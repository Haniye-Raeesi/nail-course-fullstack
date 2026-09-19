using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NailCourse.Application.DTOs;
using NailCourse.Infrastructure.Identity;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NailCourse.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;
    private readonly RoleManager<IdentityRole> _roleManager;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration,
        RoleManager<IdentityRole> roleManager)
    {
        _userManager = userManager;
        _configuration = configuration;
        _roleManager = roleManager;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);

        if (existingUser != null)
        {
            return BadRequest(new
            {
                message = "User with this email already exists."
            });
        }

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName
        };

        var result = await _userManager.CreateAsync(
            user,
            dto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        // Every newly registered account starts as a Student.
        // Teacher/Admin roles are granted only by trusted server-side configuration or administration.
        var roleResult = await _userManager.AddToRoleAsync(user, "Student");
        if (!roleResult.Succeeded)
        {
            await _userManager.DeleteAsync(user);
            return StatusCode(StatusCodes.Status500InternalServerError, new
            {
                message = "Unable to assign the default student role."
            });
        }

        var token = await GenerateToken(user);

        return Ok(new
        {
            token,
            message = "Registration successful."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        if (await _userManager.IsLockedOutAsync(user))
            return Unauthorized(new { message = "Account temporarily locked. Try again later." });

        var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!validPassword)
        {
            await _userManager.AccessFailedAsync(user);
            return Unauthorized(new { message = "Invalid email or password." });
        }
        await _userManager.ResetAccessFailedCountAsync(user);

        // Legacy accounts created before role assignment get the least-privileged role.
        var roles = await _userManager.GetRolesAsync(user);
        if (roles.Count == 0)
            await _userManager.AddToRoleAsync(user, "Student");

        var token = await GenerateToken(user);

        return Ok(new
        {
            token
        });
    }

    private async Task<string> GenerateToken(ApplicationUser user)
    {
        var key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "JWT Key is missing.");

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(ClaimTypes.NameIdentifier, user.Id),
            new(ClaimTypes.Email, user.Email!)
        };

        var roles = await _userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var expirationMinutes =
            _configuration.GetValue<int>(
                "Jwt:ExpirationMinutes");

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                expirationMinutes),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}
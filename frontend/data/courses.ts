export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  oldPrice?: number;
  category: string;
  level: string;
  lessons: number;
  duration: string;
  rating: number;
  students: number;
  badge?: string;
  featured?: boolean;
  image: string;
  discount?: number;
}

export const courses: Course[] = [
  {
    id: "1",
    title: "کاشت ناخن صفر تا صد",
    slug: "nail-extension-zero-to-hero",
    description:
      "آموزش کامل کاشت ناخن از مبانی اولیه تا اجرای حرفه‌ای و ورود به بازار کار.",
    price: 1800000,
    oldPrice: 2400000,
    category: "کاشت ناخن",
    level: "مبتدی",
    lessons: 18,
    duration: "۶ ساعت",
    rating: 4.9,
    students: 1240,
    badge: "پرفروش",
    featured: true,
    image: "/images/generated/courses/course-1.jpg",
    discount: 25,
  },
  {
    id: "2",
    title: "طراحی ناخن با ژل",
    slug: "gel-nail-design",
    description:
      "تکنیک‌های جذاب طراحی ناخن با ژل و اجرای طرح‌های حرفه‌ای.",
    price: 1200000,
    oldPrice: 1600000,
    category: "طراحی ناخن",
    level: "متوسط",
    lessons: 16,
    duration: "۵ ساعت",
    rating: 4.8,
    students: 870,
    badge: "محبوب",
    image: "/images/generated/courses/course-2.jpg",
    discount: 25,
  },
  {
    id: "3",
    title: "آموزش حرفه‌ای کاشت ناخن",
    slug: "nail-extension",
    description:
      "مسیر کامل یادگیری کاشت ناخن برای شروع فعالیت حرفه‌ای.",
    price: 1500000,
    category: "کاشت ناخن",
    level: "مبتدی",
    lessons: 14,
    duration: "۴ ساعت",
    rating: 4.7,
    students: 620,
    image: "/images/generated/courses/course-3.jpg",
  },
  {
    id: "4",
    title: "طراحی سه‌بعدی ناخن",
    slug: "3d-nail-design",
    description:
      "آموزش طراحی‌های خاص و سه‌بعدی برای ساخت استایل‌های متفاوت.",
    price: 2100000,
    oldPrice: 2800000,
    category: "طراحی ناخن",
    level: "پیشرفته",
    lessons: 12,
    duration: "۴ ساعت",
    rating: 4.9,
    students: 430,
    badge: "جدید",
    image: "/images/generated/courses/course-4.jpg",
    discount: 25,
  },
];
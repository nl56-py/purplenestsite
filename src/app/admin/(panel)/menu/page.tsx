import { requireAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui";
import { MenuForm } from "@/components/admin/menu-form";
import type { MealDay } from "@/lib/types";

export default async function MenuAdminPage() {
  const { supabase } = await requireAdmin();
  const { data } = await supabase.from("meal_menu").select("*").order("day");
  const byDay = new Map(((data ?? []) as MealDay[]).map((d) => [d.day, d]));
  const menu = Array.from({ length: 7 }, (_, day) => byDay.get(day) ?? { day, breakfast: "", lunch: "", snacks: "", dinner: "" });
  return (
    <>
      <PageHeader
        title="Weekly food menu"
        description="Visitors see today's menu highlighted. Leave a whole column empty to hide that meal; leave everything empty to hide the menu section."
      />
      <MenuForm menu={menu} />
    </>
  );
}

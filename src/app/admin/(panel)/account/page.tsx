import { requireAdmin } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui";
import { PasswordForm } from "@/components/admin/password-form";

export default async function AccountPage() {
  const { user } = await requireAdmin();
  return (
    <>
      <PageHeader title="My account" description={`Signed in as ${user.email}`} />
      <PasswordForm />
    </>
  );
}

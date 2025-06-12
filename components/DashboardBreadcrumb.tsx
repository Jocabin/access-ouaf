import { BreadCrumb } from "primereact/breadcrumb"
import { MenuItem } from "primereact/menuitem"

interface DashboardBreadcrumbProps {
  pageName: string
  pageSlug: string
}

export default function DashboardBreadcrumb({
  pageName,
  pageSlug,
}: DashboardBreadcrumbProps) {
  const homeBreadcrumbItem = { icon: "pi pi-fw pi-home", url: "/" } as MenuItem

  const breadcrumbItems = [
    {
      label: "Mon espace client",
      url: `/dashboard`,
    },
    {
      label: pageName,
      url: `/dashboard/${pageSlug}`,
    },
  ] as MenuItem[]

  return <BreadCrumb model={breadcrumbItems} home={homeBreadcrumbItem} />
}

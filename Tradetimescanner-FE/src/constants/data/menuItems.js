import {
  dashboard,
  dept,
  invoice,
  patients,
  permission,
  profile,
  services,
  staff,
} from "../imports";

const items = [
  {
    label: "Dashboard",
    image: dashboard,
    path: "/",
  },
  {
    label: "Departments",
    image: dept,
    path: "/dept",
  },
  {
    label: "Staff",
    image: staff,
    path: "/hospital/staff",
  },
  {
    label: "Services",
    image: services,
    path: "/hospital/categories",
  },
  {
    label: "Patients",
    image: patients,
    path: "/hospital/patients",
  },
  {
    label: "Invoice",
    image: invoice,
    path: "/hospital/invoice",
  },
  {
    label: "Permissions",
    image: permission,
    path: "/hospital/permissions",
  },
  {
    label: "Profile",
    image: profile,
    path: "/Profile",
  },
];
export { items };

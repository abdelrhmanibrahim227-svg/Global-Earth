import AdminLayout from "@/components/admin/AdminLayout";

export const metadata = {
    title: "Global Earth. - Admin",
    description: "Global Earth. - Admin",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}

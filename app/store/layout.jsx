import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Global Earth. - Store Dashboard",
    description: "Global Earth. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}

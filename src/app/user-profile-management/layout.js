import UserSideBar from "@/components/user-profile-management/UserSideBar";


export const metadata = {
    title: "UpImage - Built for designers, marketers, and everyday creators who want fast, professional results without technical hassle.",
    description: `UpImage is an all-in-one AI-powered platform for image and document enhancement.
From background removal and image restoration to AI generation and PDF summarization, UpImage gives you powerful creative tools in one seamless workspace.`,
};

export default function ProfileLayout({ children }) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <UserSideBar />
                {children}
            </div>
        </div>
    );
}







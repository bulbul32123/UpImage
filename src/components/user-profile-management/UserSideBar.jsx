
"use client";
import React, { useMemo } from "react";
import { useCallback } from "react";
import Icon from "../AppIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { tabs } from "@/utils/data";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export default function UserSideBar() {
    const pathname = usePathname();
    const { user, formData, loading } = useAuth();
    const basePath = "/user-profile-management";
    const tempUserPlan = true;

    const memoizedTabs = useMemo(() => tabs, []);

    const isActive = useCallback(
        (tabId) => {
            const targetPath = `${basePath}/${tabId}`.replace(/\/$/, "");
            const normalizedPath = pathname.replace(/\/$/, "");
            return (
                normalizedPath === targetPath ||
                (tabId === "" && normalizedPath === basePath)
            );
        },
        [pathname]
    );


    return (
        <div className="col-span-1 lg:col-span-1 max-md:hidden">
            <div className="bg-card rounded-lg border border-border shadow-resting p-6 sticky top-20">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                        {!loading ? (
                            <Image
                                src={formData?.profileImage}
                                alt="Profile"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover rounded-full"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center rounded-full justify-center animate-pulse">
                                <Icon name="User" size={22} color="var(--color-muted-foreground)" />
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">
                            {user?.name}
                        </h2>
                        {tempUserPlan && (
                            <span className="bg-[#ECFF79] border select-none text-black text-[12px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                                PRO PLAN
                            </span>
                        )}
                    </div>
                </div>

                <nav className="space-y-2">
                    {memoizedTabs.map((tab) => {
                        const active = isActive(tab.id);
                        return (
                            <Link
                                href={`${basePath}/${tab.id}`}
                                key={tab.id}
                                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${active
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-white text-black hover:bg-muted"
                                    }`}
                            >
                                <Icon
                                    name={tab.icon}
                                    size={18}
                                    color={active ? "white" : "black"}
                                />
                                <span className="text-sm font-medium">{tab.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Quick Stats */}
                <div className="mt-8 pt-6 border-t border-border">
                    <h3 className="text-sm font-medium text-foreground mb-4">
                        Quick Stats
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Files Processed
                            </span>
                            <span className="text-xs font-medium text-foreground">1,247</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Storage Used
                            </span>
                            <span className="text-xs font-medium text-foreground">
                                3.2 GB
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                                Member Since
                            </span>
                            <span className="text-xs font-medium text-foreground">
                                Jan 2024
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { useEffect, useState } from "react";
import Layout from "./Layout";
import Title from "@/components/title";
import { BarChart3 } from "lucide-react";
import { Effect } from "@/components/animate-ui/primitives/effects/effect";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { axiosData } from "@/util/axiosWrapper";
import type { ApiResponse } from "@/types/api";

interface LoginStatsByMonth {
    month: string;
    monthLabel: string;
    count: number;
}

interface LoginStatsResponse {
    byMonth: LoginStatsByMonth[];
    total: number;
}

export default function Estadisticas() {
    const [stats, setStats] = useState<LoginStatsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            try {
                const res = await axiosData("/stats/logins", { method: "GET" }) as ApiResponse<LoginStatsResponse>;
                if (!cancelled && res?.data) {
                    setStats(res.data);
                }
            } catch {
                if (!cancelled) setStats(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const chartConfig = {
        count: {
            label: "Logins",
            color: "hsl(var(--chart-1))",
        },
    };

    return (
        <Layout>
            <div className="mb-4">
                <Title
                    text="Statistics"
                    icon={BarChart3}
                    className="text-4xl font-bold font-ztnature"
                    textAlign="left"
                />
            </div>

            {loading ? (
                <Effect slide fade delay={50}>
                    <div className="mt-4 text-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="text-muted-foreground mt-4">Loading statistics...</p>
                    </div>
                </Effect>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                    <Effect slide fade delay={50}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Logins in the app</CardTitle>
                                <CardDescription>Login count in the last 6 months</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[220px]">
                                    <AreaChart data={stats?.byMonth ?? []}>
                                        <defs>
                                            <linearGradient id="fillLogins" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-count)" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="monthLabel"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Area
                                            type="monotone"
                                            dataKey="count"
                                            stroke="var(--color-count)"
                                            fill="url(#fillLogins)"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </Effect>

                    <Effect slide fade delay={100}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Total logins</CardTitle>
                                <CardDescription>All-time login count</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center py-8">
                                <p className="text-4xl font-bold text-primary">
                                    {stats?.total ?? 0}
                                </p>
                            </CardContent>
                        </Card>
                    </Effect>
                </div>
            )}
        </Layout>
    );
}

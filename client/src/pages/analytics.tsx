import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import type { DepartmentAnalytics, RatingDistribution } from "@shared/schema";

export default function AnalyticsPage() {
  const { data: overallStats, isLoading: statsLoading } = useQuery<{
    totalReviews: number;
    averageRating: number;
    activeCourses: number;
    responseRate: number;
  }>({
    queryKey: ["/api/analytics/overview"],
  });

  const { data: departmentAnalytics, isLoading: deptLoading } = useQuery<DepartmentAnalytics[]>({
    queryKey: ["/api/analytics/departments"],
  });

  const { data: ratingDistribution, isLoading: ratingLoading } = useQuery<RatingDistribution[]>({
    queryKey: ["/api/analytics/rating-distribution"],
  });

  const { data: courses, isLoading: coursesLoading } = useQuery<any[]>({
    queryKey: ["/api/courses"],
  });

  const ratingChartData = ratingDistribution?.map(item => ({
    name: `${item.rating} Star${item.rating !== 1 ? 's' : ''}`,
    count: item.count,
    rating: item.rating
  })) || [];

  const topCourses = courses?.slice?.(0, 5).map((course: any) => ({
    name: course.code,
    rating: course.averageRating,
  })) || [];

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#22c55e'];

  const formatTrend = (trend: number) => {
    if (trend > 0) return `↗ +${trend.toFixed(1)}`;
    if (trend < 0) return `↘ ${trend.toFixed(1)}`;
    return `— 0.0`;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-chart-1";
    if (trend < 0) return "text-chart-4";
    return "text-muted-foreground";
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2" data-testid="analytics-title">
          Performance Dashboard
        </h2>
        <p className="text-muted-foreground">Academic insights and rating analysis across departments</p>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reviews</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-foreground" data-testid="total-reviews">
                    {overallStats?.totalReviews?.toLocaleString() || 0}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-chart-1/10 rounded-lg flex items-center justify-center">
                <span className="text-chart-1">📊</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Rating</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-foreground" data-testid="average-rating">
                    {overallStats?.averageRating?.toFixed(1) || 0}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-chart-2/10 rounded-lg flex items-center justify-center">
                <span className="text-chart-2">⭐</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Courses</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-foreground" data-testid="active-courses">
                    {overallStats?.activeCourses || 0}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center">
                <span className="text-chart-3">📚</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Response Rate</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-foreground" data-testid="response-rate">
                    {overallStats?.responseRate || 0}%
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center">
                <span className="text-chart-4">📈</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Rating Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {ratingLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64" data-testid="rating-distribution-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="count" 
                      fill="#22c55e"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Courses</CardTitle>
          </CardHeader>
          <CardContent>
            {coursesLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <div className="h-64" data-testid="course-performance-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topCourses}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, rating }) => `${name}: ${rating}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="rating"
                    >
                      {topCourses.map((_entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Department Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Department Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {deptLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="department-analysis-table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Department</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Courses</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Avg Rating</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Total Reviews</th>
                    <th className="text-left py-3 text-sm font-medium text-muted-foreground">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentAnalytics?.map((dept) => (
                    <tr key={dept.department} className="border-b border-border" data-testid={`dept-row-${dept.department.toLowerCase().replace(' ', '-')}`}>
                      <td className="py-3 font-medium">{dept.department}</td>
                      <td className="py-3 text-muted-foreground">{dept.courseCount}</td>
                      <td className="py-3">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">{dept.averageRating}</span>
                          <span className="text-chart-1">★</span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{dept.totalReviews}</td>
                      <td className="py-3">
                        <span className={`text-sm ${getTrendColor(dept.trend)}`}>
                          {formatTrend(dept.trend)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

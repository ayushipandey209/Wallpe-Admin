import React, { useState, useEffect } from 'react';
import { Download, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { AnalyticsService, type TimelineDataPoint, type ListingTypeDataPoint, type UserActivityDataPoint } from '../services/analyticsService';

const chartConfig: ChartConfig = {
  listings: {
    label: 'Users',
    color: 'hsl(var(--chart-1))',
  },
  users: {
    label: 'Users',
    color: 'hsl(var(--chart-2))',
  },
  campaigns: {
    label: 'Campaigns',
    color: 'hsl(var(--chart-3))',
  },
};

// Extended mock data for analytics

const engagementData = [
  { month: 'Jan', views: 12000, clicks: 1200, conversions: 240 },
  { month: 'Feb', views: 14000, clicks: 1400, conversions: 280 },
  { month: 'Mar', views: 13000, clicks: 1300, conversions: 260 },
  { month: 'Apr', views: 16000, clicks: 1600, conversions: 320 },
  { month: 'May', views: 15000, clicks: 1500, conversions: 300 },
  { month: 'Jun', views: 18000, clicks: 1800, conversions: 360 },
];

const locationData = [
  { city: 'Mumbai', listings: 245, fill: 'var(--chart-1)' },
  { city: 'Delhi', listings: 198, fill: 'var(--chart-2)' },
  { city: 'Bangalore', listings: 187, fill: 'var(--chart-3)' },
  { city: 'Chennai', listings: 156, fill: 'var(--chart-4)' },
  { city: 'Kolkata', listings: 134, fill: 'var(--chart-5)' },
  { city: 'Hyderabad', listings: 125, fill: 'var(--chart-1)' },
];

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6months');
  const [reportType, setReportType] = useState('overview');
  const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([]);
  const [typeData, setTypeData] = useState<ListingTypeDataPoint[]>([]);
  const [userCountData, setUserCountData] = useState<TimelineDataPoint[]>([]);
  const [totalUserCount, setTotalUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch all analytics data in parallel
        const [timeline, type, userCount, totalUsers] = await Promise.all([
          AnalyticsService.getListingsTimelineData(),
          AnalyticsService.getListingTypeData(),
          AnalyticsService.getMonthlyUserCountData(),
          AnalyticsService.getTotalUserCount()
        ]);
        
        console.log('Fetched analytics data:', { timeline, type, userCount, totalUsers });
        
        setTimelineData(timeline);
        setTypeData(type);
        setUserCountData(userCount);
        setTotalUserCount(totalUsers);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        // Fallback to mock data if there's an error
        setTimelineData([
          { month: 'Jan', listings: 45 },
          { month: 'Feb', listings: 52 },
          { month: 'Mar', listings: 48 },
          { month: 'Apr', listings: 61 },
          { month: 'May', listings: 55 },
          { month: 'Jun', listings: 67 }
        ]);
        setTypeData([
          { type: 'Wall', count: 450, fill: 'var(--chart-1)' },
          { type: 'Shop', count: 320, fill: 'var(--chart-2)' },
          { type: 'Vehicle', count: 280, fill: 'var(--chart-3)' },
          { type: 'Land', count: 197, fill: 'var(--chart-4)' }
        ]);
        setUserCountData([
          { month: 'Jan', listings: 0 },
          { month: 'Feb', listings: 0 },
          { month: 'Mar', listings: 0 },
          { month: 'Apr', listings: 0 },
          { month: 'May', listings: 0 },
          { month: 'Jun', listings: 0 }
        ]);
        setTotalUserCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const handleExportReport = () => {
    // Mock export functionality
    console.log('Exporting report:', { timeRange, reportType });
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Analytics & Reports</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into platform performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="listings">Listings</SelectItem>
              <SelectItem value="users">Users</SelectItem>
              <SelectItem value="revenue">Revenue</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : (
                totalUserCount.toLocaleString()
              )}
            </div>
            <p className="text-xs text-green-600">Total registered users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : (
                userCountData[userCountData.length - 1]?.listings || 0
              )}
            </div>
            <p className="text-xs text-blue-600">New users this month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18.5%</div>
            <p className="text-xs text-purple-600">+2.1% from last period</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Location</CardTitle>
            <MapPin className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Mumbai</div>
            <p className="text-xs text-orange-600">245 listings</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly User Count */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly User Count</CardTitle>
            <CardDescription>New users registered by month</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userCountData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      value.toLocaleString(), 
                      'Users'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="listings"
                    stroke="var(--chart-2)"
                    fill="var(--chart-2)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Engagement */}
        <Card>
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>Views, clicks, and conversions</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    name="Views"
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    name="Clicks"
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
                    stroke="var(--chart-3)"
                    strokeWidth={2}
                    name="Conversions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Location Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Locations</CardTitle>
            <CardDescription>Listings by city</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="listings"
                    label={({ city, listings }) => `${city}: ${listings}`}
                  >
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Listing Type Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Type Performance</CardTitle>
            <CardDescription>Revenue by listing type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData.map(item => ({ ...item, revenue: item.count * 25000 }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="var(--chart-1)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Breakdown</CardTitle>
          <CardDescription>Performance metrics by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Category</th>
                  <th className="text-right p-2">Listings</th>
                  <th className="text-right p-2">Revenue</th>
                  <th className="text-right p-2">Avg. Price</th>
                  <th className="text-right p-2">Growth</th>
                </tr>
              </thead>
              <tbody>
                {typeData.map((item) => (
                  <tr key={item.type} className="border-b">
                    <td className="p-2 font-medium capitalize">{item.type}</td>
                    <td className="p-2 text-right">{item.count}</td>
                    <td className="p-2 text-right">₹{(item.count * 25000).toLocaleString()}</td>
                    <td className="p-2 text-right">₹{25000}</td>
                    <td className="p-2 text-right text-green-600">+{(Math.random() * 20).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { User, Users, Filter, Search, Target, Check, X, ChevronDown, Users2, UserCheck, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockUsers } from '../data/mockData';

export interface UserSelection {
  type: 'individual' | 'group' | 'criteria' | 'all';
  userIds: string[];
  groupIds: string[];
  criteria: Record<string, any>;
  estimatedCount: number;
}

interface AdvancedUserSelectorProps {
  onSelectionChange: (selection: UserSelection) => void;
  initialSelection?: UserSelection;
}

// Mock user groups for demonstration
const mockUserGroups = [
  { id: 'group-1', name: 'Premium Users', count: 1247, description: 'Users with premium subscriptions' },
  { id: 'group-2', name: 'New Users', count: 523, description: 'Users who joined in the last 30 days' },
  { id: 'group-3', name: 'Active Campaigns', count: 892, description: 'Users with active advertising campaigns' },
  { id: 'group-4', name: 'High Engagement', count: 156, description: 'Users with high interaction rates' },
  { id: 'group-5', name: 'Location: Mumbai', count: 234, description: 'Users located in Mumbai' },
  { id: 'group-6', name: 'Location: Delhi', count: 189, description: 'Users located in Delhi' },
  { id: 'group-7', name: 'Location: Bangalore', count: 167, description: 'Users located in Bangalore' },
  { id: 'group-8', name: 'Pending Verification', count: 45, description: 'Users awaiting account verification' }
];

// Mock criteria options
const criteriaOptions = {
  status: [
    { value: 'active', label: 'Active Users', count: 1247 },
    { value: 'suspended', label: 'Suspended Users', count: 23 },
    { value: 'pending', label: 'Pending Users', count: 45 }
  ],
  joinDate: [
    { value: 'last-7-days', label: 'Last 7 Days', count: 89 },
    { value: 'last-30-days', label: 'Last 30 Days', count: 234 },
    { value: 'last-90-days', label: 'Last 90 Days', count: 567 },
    { value: 'last-year', label: 'Last Year', count: 1247 }
  ],
  listings: [
    { value: 'has-listings', label: 'Has Listings', count: 892 },
    { value: 'no-listings', label: 'No Listings', count: 355 },
    { value: 'multiple-listings', label: 'Multiple Listings', count: 567 }
  ],
  campaigns: [
    { value: 'active-campaigns', label: 'Active Campaigns', count: 234 },
    { value: 'no-campaigns', label: 'No Campaigns', count: 1013 },
    { value: 'completed-campaigns', label: 'Completed Campaigns', count: 456 }
  ]
};

export function AdvancedUserSelector({ onSelectionChange, initialSelection }: AdvancedUserSelectorProps) {
  const [selection, setSelection] = useState<UserSelection>(
    initialSelection || {
      type: 'all',
      userIds: [],
      groupIds: [],
      criteria: {},
      estimatedCount: mockUsers.length
    }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserList, setShowUserList] = useState(false);

  // Update parent component when selection changes
  useEffect(() => {
    onSelectionChange(selection);
  }, [selection, onSelectionChange]);

  const handleSelectionTypeChange = (type: UserSelection['type']) => {
    const newSelection: UserSelection = {
      type,
      userIds: [],
      groupIds: [],
      criteria: {},
      estimatedCount: 0
    };

    // Set default estimated count based on type
    switch (type) {
      case 'all':
        newSelection.estimatedCount = mockUsers.length;
        break;
      case 'individual':
        newSelection.estimatedCount = selectedUsers.length;
        newSelection.userIds = selectedUsers;
        break;
      case 'group':
        newSelection.estimatedCount = 0; // Will be calculated when groups are selected
        break;
      case 'criteria':
        newSelection.estimatedCount = 0; // Will be calculated when criteria are applied
        break;
    }

    setSelection(newSelection);
  };

  const handleUserToggle = (userId: string, checked: boolean) => {
    let newSelectedUsers;
    if (checked) {
      newSelectedUsers = [...selectedUsers, userId];
    } else {
      newSelectedUsers = selectedUsers.filter(id => id !== userId);
    }
    setSelectedUsers(newSelectedUsers);

    if (selection.type === 'individual') {
      const newSelection = {
        ...selection,
        userIds: newSelectedUsers,
        estimatedCount: newSelectedUsers.length
      };
      setSelection(newSelection);
    }
  };

  const handleGroupToggle = (groupId: string, checked: boolean) => {
    let newGroupIds;
    if (checked) {
      newGroupIds = [...selection.groupIds, groupId];
    } else {
      newGroupIds = selection.groupIds.filter(id => id !== groupId);
    }

    // Calculate estimated count for selected groups
    const selectedGroups = mockUserGroups.filter(group => newGroupIds.includes(group.id));
    const estimatedCount = selectedGroups.reduce((sum, group) => sum + group.count, 0);

    const newSelection = {
      ...selection,
      groupIds: newGroupIds,
      estimatedCount
    };
    setSelection(newSelection);
  };

  const handleCriteriaChange = (category: string, value: string, checked: boolean) => {
    const newCriteria = { ...selection.criteria };
    
    if (checked) {
      if (!newCriteria[category]) {
        newCriteria[category] = [];
      }
      newCriteria[category] = [...(newCriteria[category] || []), value];
    } else {
      newCriteria[category] = (newCriteria[category] || []).filter((v: string) => v !== value);
      if (newCriteria[category].length === 0) {
        delete newCriteria[category];
      }
    }

    // Calculate estimated count based on criteria
    let estimatedCount = 0;
    Object.values(newCriteria).forEach((values: any) => {
      if (Array.isArray(values)) {
        values.forEach((value: string) => {
          // Find matching criteria option and add its count
          Object.values(criteriaOptions).forEach(options => {
            const option = options.find(opt => opt.value === value);
            if (option) {
              estimatedCount += option.count;
            }
          });
        });
      }
    });

    const newSelection = {
      ...selection,
      criteria: newCriteria,
      estimatedCount: Math.min(estimatedCount, mockUsers.length) // Cap at total users
    };
    setSelection(newSelection);
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const renderIndividualSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">Select Individual Users</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowUserList(!showUserList)}
        >
          {showUserList ? 'Hide List' : 'Show List'}
        </Button>
      </div>

      {showUserList && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="max-h-64 overflow-y-auto border rounded-lg">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center space-x-3 p-3 border-b last:border-b-0">
                <Checkbox
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={(checked) => handleUserToggle(user.id, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {user.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedUsers.length > 0 && (
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <UserCheck className="w-4 h-4 text-primary" />
            <span className="font-medium">{selectedUsers.length} users selected</span>
          </div>
        </div>
      )}
    </div>
  );

  const renderGroupSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users2 className="w-4 h-4" />
        <span className="text-sm font-medium">Select User Groups</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {mockUserGroups.map((group) => (
          <div key={group.id} className="flex items-center space-x-3 p-3 border rounded-lg">
            <Checkbox
              checked={selection.groupIds.includes(group.id)}
              onCheckedChange={(checked) => handleGroupToggle(group.id, checked as boolean)}
            />
            <div className="flex-1">
              <div className="font-medium text-sm">{group.name}</div>
              <div className="text-xs text-muted-foreground">{group.description}</div>
            </div>
            <Badge variant="outline" className="text-xs">
              {group.count} users
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCriteriaSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Apply Smart Filters</span>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="joinDate">Join Date</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        {Object.entries(criteriaOptions).map(([category, options]) => (
          <TabsContent key={category} value={category} className="space-y-3">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Checkbox
                  checked={selection.criteria[category]?.includes(option.value) || false}
                  onCheckedChange={(checked) => handleCriteriaChange(category, option.value, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">{option.label}</div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {option.count} users
                </Badge>
              </div>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  const renderAllUsersSelection = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">All Users</span>
      </div>
      <div className="bg-muted/30 rounded-lg p-4 text-center">
        <div className="text-2xl font-bold text-primary">{mockUsers.length.toLocaleString()}</div>
        <div className="text-sm text-muted-foreground">Total registered users</div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Select Recipients
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button
            variant={selection.type === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSelectionTypeChange('all')}
            className="flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            All Users
          </Button>
          <Button
            variant={selection.type === 'individual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSelectionTypeChange('individual')}
            className="flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            Individual
          </Button>
          <Button
            variant={selection.type === 'group' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSelectionTypeChange('group')}
            className="flex items-center gap-2"
          >
            <Users2 className="w-4 h-4" />
            Groups
          </Button>
          <Button
            variant={selection.type === 'criteria' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSelectionTypeChange('criteria')}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Smart Filter
          </Button>
        </div>

        {selection.type === 'all' && renderAllUsersSelection()}
        {selection.type === 'individual' && renderIndividualSelection()}
        {selection.type === 'group' && renderGroupSelection()}
        {selection.type === 'criteria' && renderCriteriaSelection()}

        {selection.estimatedCount > 0 && (
          <div className="bg-primary/10 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Target className="w-4 h-4" />
              Estimated Recipients: {selection.estimatedCount.toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from 'react';
import { Search, UserX, UserCheck, Send, Eye, MoreHorizontal, Loader2, Download, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ProfileService, type ProfileWithStats } from '../services';

export function UserManagement() {
  const [users, setUsers] = useState<ProfileWithStats[]>([]);
  const [selectedUser, setSelectedUser] = useState<ProfileWithStats | null>(null);
  const [userListings, setUserListings] = useState<any[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [downloadingContacts, setDownloadingContacts] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);

  // Fetch users from Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ProfileService.getAllProfiles();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchQuery || 
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.phone.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (userId: string, newStatus: 'Active' | 'InActive') => {
    try {
      setUpdatingStatus(userId);
      setError(null);
      
      console.log('Button clicked - updating status:', { userId, newStatus });
      
      // Update the user status in Supabase
      const updatedProfile = await ProfileService.updateUserStatus(userId, newStatus);
      
      console.log('Updated profile from database:', updatedProfile);
      
      // Update the local state with the actual database values
      setUsers(users.map(user => 
        user.id === userId ? { 
          ...user, 
          status: newStatus, 
          user_status: updatedProfile.user_status 
        } : user
      ));
      
      // Update selected user if it's the same user
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser({ 
          ...selectedUser, 
          status: newStatus, 
          user_status: updatedProfile.user_status 
        });
      }
      
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      setDeletingUser(userId);
      setError(null);
      
      // Delete the user from Supabase
      await ProfileService.deleteProfile(userId);
      
      // Remove the user from local state
      setUsers(users.filter(user => user.id !== userId));
      
      // Clear selected user if it's the deleted user
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser(null);
      }
      
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    } finally {
      setDeletingUser(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Active: 'default' as const,
      InActive: 'destructive' as const
    };
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const loadUserListings = async (userId: string) => {
    try {
      setListingsLoading(true);
      const spaces = await ProfileService.getUserSpaces(userId);
      const listings = spaces.map(space => ({
        id: space.id,
        name: space.name,
        type: space.type,
        status: space.list_status || 'pending',
        location: space.address ? 
          `${space.address.city || ''}, ${space.address.district || ''}`.trim() || 
          `${space.address.village || ''}, ${space.address.state || ''}`.trim() || 
          'No location' 
          : 'No address',
        created_at: space.created_at
      }));
      setUserListings(listings);
    } catch (error) {
      console.error('Error fetching user listings:', error);
      setUserListings([]);
    } finally {
      setListingsLoading(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Download contact details as CSV
  const downloadContactsAsCSV = async (userId: string, userName: string) => {
    try {
      setDownloadingContacts(userId);
      const contacts = await ProfileService.getUserContactDetails(userId);
      
      if (contacts.length === 0) {
        alert('No contact details found for this user.');
        return;
      }

      // Create CSV content
      const headers = ['Contact Name', 'Contact Number'];
      const csvContent = [
        headers.join(','),
        ...contacts.map(contact => [
          `"${contact.contactname || 'N/A'}"`,
          `"${contact.contactnumber || 'N/A'}"`
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${userName}_contacts.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading contacts as CSV:', error);
      alert('Failed to download contact details: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setDownloadingContacts(null);
    }
  };

  // Download contact details as JSON
  const downloadContactsAsJSON = async (userId: string, userName: string) => {
    try {
      setDownloadingContacts(userId);
      const contacts = await ProfileService.getUserContactDetails(userId);
      
      if (contacts.length === 0) {
        alert('No contact details found for this user.');
        return;
      }

      // Create JSON content
      const jsonContent = JSON.stringify(contacts, null, 2);

      // Create and download file
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${userName}_contacts.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading contacts as JSON:', error);
      alert('Failed to download contact details: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setDownloadingContacts(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading users...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="InActive">InActive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Total Listings</TableHead>
                  <TableHead>Active Campaigns</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&facepad=2&random=${user.id}`} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name || 'Unknown User'}</p>
                          <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{user.email || 'No email'}</p>
                        <p className="text-sm text-muted-foreground">{user.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{user.totalListings || 0}</TableCell>
                    <TableCell className="text-center">{user.activeCampaigns || 0}</TableCell>
                    <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => {
                                setSelectedUser(user);
                                loadUserListings(user.id);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <div className="flex items-center justify-between pr-8">
                                <DialogTitle>User Profile - {user.name}</DialogTitle>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      disabled={deletingUser === user.id}
                                      className="ml-4"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      {deletingUser === user.id ? 'Deleting...' : 'Delete User'}
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user
                                        "{user.name}" and remove all associated data from the database.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                        disabled={deletingUser === user.id}
                                      >
                                        {deletingUser === user.id ? 'Deleting...' : 'Delete'}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-6">
                                {/* User Basic Info */}
                                <div className="flex items-center space-x-4">
                                  <Avatar className="h-16 w-16">
                                    <AvatarImage src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&facepad=2&random=${selectedUser.id}`} />
                                    <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <h3 className="text-lg font-medium">{selectedUser.name || 'Unknown User'}</h3>
                                    <p className="text-muted-foreground">{selectedUser.email || 'No email'}</p>
                                    <p className="text-muted-foreground">{selectedUser.phone}</p>
                                  </div>
                                </div>

                                {/* User Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                  <Card>
                                    <CardContent className="pt-4">
                                      <div className="text-center">
                                        <div className="text-2xl font-bold">{selectedUser.totalListings || 0}</div>
                                        <p className="text-xs text-muted-foreground">Total Listings</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="pt-4">
                                      <div className="text-center">
                                        <div className="text-2xl font-bold">{selectedUser.activeCampaigns || 0}</div>
                                        <p className="text-xs text-muted-foreground">Active Campaigns</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <Card>
                                    <CardContent className="pt-4">
                                      <div className="text-center">
                                        <div className="text-2xl font-bold">{new Date(selectedUser.created_at).getFullYear()}</div>
                                        <p className="text-xs text-muted-foreground">Member Since</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>

                                {/* User Listings */}
                                <div>
                                  <h4 className="font-medium mb-3">User Listings ({userListings.length})</h4>
                                  <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {listingsLoading ? (
                                      <div className="flex items-center justify-center py-4">
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        <span className="text-sm text-muted-foreground">Loading listings...</span>
                                      </div>
                                    ) : (
                                      <>
                                        {userListings.map((listing) => (
                                          <div key={listing.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div>
                                              <p className="font-medium">{listing.name || listing.id}</p>
                                              <p className="text-sm text-muted-foreground">{listing.location}</p>
                                              <p className="text-xs text-muted-foreground">
                                                Created: {new Date(listing.created_at).toLocaleDateString()}
                                              </p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                              <Badge className="capitalize">{listing.type}</Badge>
                                              <Badge
                                                variant={
                                                  listing.status === 'approved' ? 'default' :
                                                  listing.status === 'pending' ? 'secondary' :
                                                  'destructive'
                                                }
                                              >
                                                {listing.status}
                                              </Badge>
                                            </div>
                                          </div>
                                        ))}
                                        {userListings.length === 0 && (
                                          <p className="text-center text-muted-foreground py-4">No listings found</p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2 pt-4 border-t">
                                  <Button 
                                    onClick={() => handleStatusChange(selectedUser.id, 'Active')}
                                    disabled={selectedUser.status === 'Active' || updatingStatus === selectedUser.id}
                                    variant={selectedUser.status === 'Active' ? 'secondary' : 'default'}
                                  >
                                    {updatingStatus === selectedUser.id ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <UserCheck className="w-4 h-4 mr-2" />
                                    )}
                                    {selectedUser.status === 'Active' ? 'Active' : 'Activate'}
                                  </Button>
                                  <Button 
                                    variant={selectedUser.status === 'InActive' ? 'secondary' : 'destructive'}
                                    onClick={() => handleStatusChange(selectedUser.id, 'InActive')}
                                    disabled={selectedUser.status === 'InActive' || updatingStatus === selectedUser.id}
                                  >
                                    {updatingStatus === selectedUser.id ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <UserX className="w-4 h-4 mr-2" />
                                    )}
                                    {selectedUser.status === 'InActive' ? 'InActive' : 'Deactivate'}
                                  </Button>
                                  <Button variant="outline" disabled={updatingStatus === selectedUser.id}>
                                    <Send className="w-4 h-4 mr-2" />
                                    Send Message
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    disabled={downloadingContacts === selectedUser.id}
                                    onClick={() => downloadContactsAsCSV(selectedUser.id, selectedUser.name || 'User')}
                                  >
                                    {downloadingContacts === selectedUser.id ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <Download className="w-4 h-4 mr-2" />
                                    )}
                                    Download CSV
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    disabled={downloadingContacts === selectedUser.id}
                                    onClick={() => downloadContactsAsJSON(selectedUser.id, selectedUser.name || 'User')}
                                  >
                                    {downloadingContacts === selectedUser.id ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <Download className="w-4 h-4 mr-2" />
                                    )}
                                    Download JSON
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(user.id, 'Active')}
                              disabled={user.status === 'Active' || updatingStatus === user.id}
                            >
                              Activate User
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(user.id, 'InActive')}
                              disabled={user.status === 'InActive' || updatingStatus === user.id}
                            >
                              Deactivate User
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={updatingStatus === user.id}>
                              Send Notification
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled={updatingStatus === user.id}>
                              Verify User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
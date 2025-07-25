import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  User as UserIcon,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Calendar,
  Mail
} from 'lucide-react';

interface UserManagementPageProps {
  onNavigate: (page: string) => void;
}

export function UserManagementPage({ onNavigate }: UserManagementPageProps) {
  const { users, createUser, updateUser, deleteUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUser = async (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => {
    const success = await createUser(userData);
    if (success) {
      setShowCreateModal(false);
    }
  };

  const handleUpdateUser = (id: string, updates: Partial<User>) => {
    updateUser(id, updates);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-blue-100">Manage system users and permissions</p>
              </div>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              <Plus className="w-5 h-5" />
              Add User
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'user')}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="user">Users</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">User</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Role</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Created</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Last Login</th>
                  <th className="text-right py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {user.role === 'admin' ? (
                            <Shield className="w-5 h-5" />
                          ) : (
                            <UserIcon className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {user.lastLogin ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(user.lastLogin).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateUser(user.id, { isActive: !user.isActive })}
                          className={`p-2 rounded-lg transition-colors ${
                            user.isActive
                              ? 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {user.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <CreateUserModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateUser}
          />
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <EditUserModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
            onSubmit={(updates) => handleUpdateUser(editingUser.id, updates)}
          />
        )}
      </div>
    </MainLayout>
  );
}

// Create User Modal Component
function CreateUserModal({ 
  onClose, 
  onSubmit 
}: { 
  onClose: () => void; 
  onSubmit: (userData: Omit<User, 'id' | 'createdAt' | 'isActive'>) => void; 
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New User</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create User
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit User Modal Component
function EditUserModal({ 
  user, 
  onClose, 
  onSubmit 
}: { 
  user: User; 
  onClose: () => void; 
  onSubmit: (updates: Partial<User>) => void; 
}) {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">Active User</label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Update User
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
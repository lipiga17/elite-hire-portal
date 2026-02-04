import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Building2, Globe, Linkedin, MapPin, User, 
  Briefcase, Mail, Edit2, Save, X, Upload 
} from 'lucide-react';

const OFFICE_LOCATIONS = [
  'New York', 'San Francisco', 'Boston', 'Chicago', 'Austin', 
  'Seattle', 'Los Angeles', 'Denver', 'Atlanta', 'Miami', 'Remote'
];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    companyWebsite: user?.companyWebsite || '',
    companyLinkedIn: user?.companyLinkedIn || '',
    officeLocations: user?.officeLocations || [],
    hirerName: user?.hirerName || '',
    hirerTitle: user?.hirerTitle || '',
    companyLogoPreview: user?.companyLogoPreview || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          companyLogoPreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleLocation = (location) => {
    const current = formData.officeLocations;
    if (current.includes(location)) {
      setFormData({
        ...formData,
        officeLocations: current.filter(l => l !== location),
      });
    } else {
      setFormData({
        ...formData,
        officeLocations: [...current, location],
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    updateProfile(formData);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      companyName: user?.companyName || '',
      companyWebsite: user?.companyWebsite || '',
      companyLinkedIn: user?.companyLinkedIn || '',
      officeLocations: user?.officeLocations || [],
      hirerName: user?.hirerName || '',
      hirerTitle: user?.hirerTitle || '',
      companyLogoPreview: user?.companyLogoPreview || '',
    });
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your company and personal information
            </p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        {/* Company Information */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Company Information
          </h2>

          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <div className="relative">
                {formData.companyLogoPreview ? (
                  <img 
                    src={formData.companyLogoPreview} 
                    alt="Company logo" 
                    className="w-20 h-20 rounded-lg object-cover border border-border"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-primary/90 transition-colors">
                    <Upload className="w-4 h-4" />
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">{formData.companyName || 'Company Name'}</p>
                <p className="text-sm text-muted-foreground">Company Logo</p>
              </div>
            </div>

            {/* Company Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                {isEditing ? (
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 h-10 px-3 bg-muted rounded-md">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{user?.companyName || '-'}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Website</Label>
                {isEditing ? (
                  <Input
                    id="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 h-10 px-3 bg-muted rounded-md">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    {user?.companyWebsite ? (
                      <a href={user.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {user.companyWebsite}
                      </a>
                    ) : (
                      <span className="text-foreground">-</span>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyLinkedIn">LinkedIn</Label>
                {isEditing ? (
                  <Input
                    id="companyLinkedIn"
                    value={formData.companyLinkedIn}
                    onChange={(e) => setFormData({ ...formData, companyLinkedIn: e.target.value })}
                  />
                ) : (
                  <div className="flex items-center gap-2 h-10 px-3 bg-muted rounded-md">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                    {user?.companyLinkedIn ? (
                      <a href={user.companyLinkedIn} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {user.companyLinkedIn}
                      </a>
                    ) : (
                      <span className="text-foreground">-</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Office Locations */}
            <div className="space-y-2">
              <Label>Office Locations</Label>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {OFFICE_LOCATIONS.map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => toggleLocation(location)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${formData.officeLocations.includes(location)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-accent'
                        }`}
                    >
                      <MapPin className="inline-block w-3 h-3 mr-1" />
                      {location}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(user?.officeLocations || []).map((location) => (
                    <span key={location} className="px-3 py-1.5 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
                      <MapPin className="inline-block w-3 h-3 mr-1" />
                      {location}
                    </span>
                  ))}
                  {(!user?.officeLocations || user.officeLocations.length === 0) && (
                    <span className="text-muted-foreground">No locations set</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hirerName">Your Name</Label>
              {isEditing ? (
                <Input
                  id="hirerName"
                  value={formData.hirerName}
                  onChange={(e) => setFormData({ ...formData, hirerName: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2 h-10 px-3 bg-muted rounded-md">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{user?.hirerName || '-'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hirerTitle">Your Title</Label>
              {isEditing ? (
                <Input
                  id="hirerTitle"
                  value={formData.hirerTitle}
                  onChange={(e) => setFormData({ ...formData, hirerTitle: e.target.value })}
                />
              ) : (
                <div className="flex items-center gap-2 h-10 px-3 bg-muted rounded-md">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{user?.hirerTitle || '-'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Email Address</Label>
              <div className="flex items-center gap-2 h-10 px-3 bg-muted rounded-md">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{user?.email || '-'}</span>
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

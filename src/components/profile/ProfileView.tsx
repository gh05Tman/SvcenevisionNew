
"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { UserCircleIcon, MailIcon, ShieldCheckIcon, SunIcon, MoonIcon, PaletteIcon, BellIcon, Edit3Icon } from 'lucide-react';

export function ProfileView() {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  // Mock local state for settings
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [profilePicUrl, setProfilePicUrl] = useState(user?.photoURL || ''); // For potential upload
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>('24h');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  if (loading || !user) {
    return <p>Loading profile...</p>; // Or a skeleton loader
  }

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save operation
    console.log("Saving profile changes:", { displayName, temperatureUnit, timeFormat, enableNotifications });
    toast({ title: "Profile Updated", description: "Your changes have been saved." });
    setIsEditing(false);
  };
  
  const userInitials = user.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()
    : user.email?.[0].toUpperCase() || 'U';

  return (
    <div className="space-y-8">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-montserrat flex items-center">
              <UserCircleIcon className="mr-3 h-7 w-7 text-primary" /> My Profile
            </CardTitle>
            <CardDescription>Manage your account information and preferences.</CardDescription>
          </div>
          <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "secondary" : "outline"}>
            <Edit3Icon className="mr-2 h-4 w-4" /> {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveChanges} className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-primary shadow-md">
                        <AvatarImage src={profilePicUrl || user.photoURL || undefined} alt={user.displayName || "User"} />
                        <AvatarFallback className="text-4xl bg-muted text-muted-foreground">{userInitials}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <Button size="sm" variant="outline" className="absolute bottom-0 right-0 rounded-full group-hover:opacity-100 md:opacity-0 transition-opacity" onClick={() => alert("Change picture not implemented")}>
                            <Edit3Icon className="h-3 w-3"/>
                        </Button>
                    )}
                </div>

              <div className="flex-grow space-y-4 w-full">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input id="displayName" value={isEditing ? displayName : user.displayName || ''} onChange={e => setDisplayName(e.target.value)} disabled={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center"><MailIcon className="mr-2 h-4 w-4 text-muted-foreground" />Email</Label>
                  <Input id="email" type="email" value={user.email || ''} disabled className="bg-muted/50" />
                </div>
                <div>
                  <Label htmlFor="tier" className="flex items-center"><ShieldCheckIcon className="mr-2 h-4 w-4 text-muted-foreground" />Account Tier</Label>
                  <Input id="tier" value={user.tier.toUpperCase()} disabled className="bg-muted/50 font-semibold text-primary" />
                </div>
              </div>
            </div>
            
            {isEditing && (
                <Button type="submit">Save Changes</Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-montserrat flex items-center"><PaletteIcon className="mr-3 h-6 w-6 text-primary"/>Preferences</CardTitle>
          <CardDescription>Customize your SceneVision experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-3 rounded-md border">
                <Label htmlFor="temperatureUnit" className="flex items-center">
                    {temperatureUnit === 'C' ? <SunIcon className="mr-2 h-5 w-5 text-orange-400"/> : <SunIcon className="mr-2 h-5 w-5 text-blue-400"/>}
                    Temperature Unit
                </Label>
                <Select value={temperatureUnit} onValueChange={(value: 'C' | 'F') => setTemperatureUnit(value)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                        <SelectItem value="C">Celsius (°C)</SelectItem>
                        <SelectItem value="F">Fahrenheit (°F)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md border">
                <Label htmlFor="timeFormat" className="flex items-center">
                    {timeFormat === '12h' ? <MoonIcon className="mr-2 h-5 w-5 text-purple-400"/> : <ClockIcon className="mr-2 h-5 w-5 text-green-400"/>}
                    Time Format
                </Label>
                <Select value={timeFormat} onValueChange={(value: '12h' | '24h') => setTimeFormat(value)}>
                    <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Format" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover">
                        <SelectItem value="12h">12-hour</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="flex items-center justify-between p-3 rounded-md border">
                <Label htmlFor="enableNotifications" className="flex items-center">
                    <BellIcon className="mr-2 h-5 w-5 text-yellow-400"/>
                    Enable Notifications
                    <span className="text-xs text-muted-foreground ml-1">(e.g., preview ready)</span>
                </Label>
                <Switch
                    id="enableNotifications"
                    checked={enableNotifications}
                    onCheckedChange={setEnableNotifications}
                />
            </div>
             {isEditing && ( // This save button is for preferences if they are not auto-saving
                <Button onClick={() => {
                    console.log("Saving preferences:", { temperatureUnit, timeFormat, enableNotifications });
                    toast({ title: "Preferences Saved", description: "Your settings have been updated." });
                }}>Save Preferences</Button>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

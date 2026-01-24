"use client";
import { useState } from "react";
// import { MainLayout } from "@/components/MainLayout";
import { GradientCard } from "@/components/GradientCard";
import { ContributionCalendar } from "@/components/ContributionCalendar";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  GraduationCap,
  Target,
  Award,
  Settings,
  Code2,
  Mic,
  Brain,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfile } from "@/hooks/useProfile";
import { useAchievements } from "@/hooks/useAchievements";
import { useProfileStore } from "@/store/useProfileStore";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
const ACHIEVEMENT_DEFINITIONS = [
  { key: "first_problem", title: "First Problem Solved", icon: "🎯" },
  { key: "7_day_streak", title: "7 Day Streak", icon: "🔥" },
  { key: "hr_master", title: "HR Master", icon: "🎤" },
  { key: "quant_pro", title: "Quant Pro", icon: "🧮" },
  { key: "100_problems", title: "100 Problems", icon: "💯" },
  { key: "interview_ready", title: "Interview Ready", icon: "🚀" },
]
const allCompanies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Uber",
  "Airbnb",
  "Twitter",
  "LinkedIn",
  "Salesforce",
  "Adobe",
  "Oracle",
  "IBM",
  "Intel",
  "Cisco",
  "VMware",
  "Stripe",
  "Coinbase",
  "Shopify",
];
// const achievements = [
//   { title: "First Problem Solved", icon: "🎯", earned: true },
//   { title: "7 Day Streak", icon: "🔥", earned: true },
//   { title: "HR Master", icon: "🎤", earned: false },
//   { title: "Quant Pro", icon: "🧮", earned: true },
//   { title: "100 Problems", icon: "💯", earned: false },
//   { title: "Interview Ready", icon: "🚀", earned: false },
// ];

// const stats = [
//   { label: "Coding Problems", value: 45, total: 150, color: "bg-coding", icon: Code2 },
//   { label: "HR Sessions", value: 12, total: 20, color: "bg-hr", icon: Mic },
//   { label: "Aptitude Quizzes", value: 28, total: 50, color: "bg-aptitude", icon: Brain },
// ];
const Profile = () => {
  // const [user, setUser] = useState({
  //   name: "John Doe",
  //   email: "john.doe@example.com",
  //   college: "IIT Delhi",
  //   targetCompanies: ["Google", "Microsoft", "Amazon"],
  //   joinedDate: "January 2024",
  // });
  const { profile, metrics, contributions, isLoading } = useProfile()
  // const { user } = useUserStore()
  const [isEditingCompanies, setIsEditingCompanies] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(profile?.targetCompanies || []);
  const { unlocked, isLoading: achievementsLoading } = useAchievements()
  const stats = [
    {
      label: "Coding Problems",
      value: metrics?.coding.solved,
      total: metrics?.coding.total,
      color: "bg-coding",
      icon: Code2,
    },
    {
      label: "HR Sessions",
      value: metrics?.hr.completed,
      total: metrics?.hr.total,
      color: "bg-hr",
      icon: Mic,
    },
    {
      label: "Aptitude Quizzes",
      value: metrics?.aptitude.completed,
      total: metrics?.aptitude.total,
      color: "bg-aptitude",
      icon: Brain,
    },
  ]


  // Mock contribution data (last 90 days)
  // const contributionData = Array.from({ length: 90 }, (_, i) => {
  //   const date = new Date();
  //   date.setDate(date.getDate() - (89 - i));
  //   return {
  //     date: date.toISOString().split("T")[0],
  //     verified: Math.random() > 0.6,
  //   };
  // });

  const toggleCompany = (company: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(company)
        ? prev.filter((c) => c !== company)
        : [...prev, company]
    );
  };
  const updateTargetCompanies = useProfileStore(
    (s) => s.updateTargetCompanies
  )
  const { getToken } = useAuth()
  const saveCompanies = async () => {
    try {
      const token = await getToken()

      const res = await api<{ targetCompanies: string[] }>(
        "/user/profile",
        {
          method: "PATCH",
          token,
          body: {
            targetCompanies: selectedCompanies,
          },
        }
      )

      updateTargetCompanies(res.targetCompanies)
      setIsEditingCompanies(false)

      toast.success("Target companies updated")
    } catch (err) {
      console.error(err)
      toast.error("Failed to update companies")
    }
  }
  if (isLoading || !profile || !metrics) {
    return <div className="p-6 text-muted-foreground">Loading profile…</div>
  }
  return (
    <>
      <div className="mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
              <Avatar className="w-20 h-20 border-4 border-background">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-foreground">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">Member since {profile.joinedAt}</p>
              </div>
              <Dialog open={isEditingCompanies} onOpenChange={setIsEditingCompanies}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Target Companies</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      Select companies you're targeting. This helps prioritize relevant questions.
                    </p>
                    <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto">
                      {allCompanies.map((company) => {
                        const isSelected = selectedCompanies.includes(company);
                        return (
                          <button
                            key={company}
                            onClick={() => toggleCompany(company)}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                              isSelected
                                ? "bg-primary/10 text-primary border-primary/30"
                                : "bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/30"
                            )}
                          >
                            {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                            {company}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCompanies(profile.targetCompanies);
                        setIsEditingCompanies(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={saveCompanies}>Save Changes</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card rounded-2xl border border-border/50 p-5 space-y-4">
              <h3 className="font-semibold text-foreground text-sm">Profile Info</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <GraduationCap className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{profile.college}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Target Companies</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.targetCompanies.map((company) => (
                    <Badge
                      key={company}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 text-xs"
                    >
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-card rounded-2xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-foreground text-sm">Achievements</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {ACHIEVEMENT_DEFINITIONS.map((a) => {
                  const earned = Boolean(unlocked[a.key])

                  return (
                    <div
                      key={a.key}
                      className={cn(
                        "p-3 rounded-xl border text-center transition-all",
                        earned
                          ? "bg-primary/5 border-primary/30"
                          : "bg-muted/30 border-border/50 opacity-40"
                      )}
                    >
                      <span className="text-xl">{a.icon}</span>
                      <p className="text-[10px] font-medium mt-1">{a.title}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Stats and Contributions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Stats */}
            <div className="bg-card rounded-2xl border border-border/50 p-5">
              <h3 className="font-semibold text-foreground text-sm mb-5">Progress Overview</h3>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <stat.icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{stat.label}</span>
                      </div>
                      <span className="font-semibold text-foreground">
                        {stat.value}/{stat.total}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-500", stat.color)}
                        style={{ width: `${((stat.value ?? 0) / (stat.total ?? 1)) * 100}%`, }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contribution Calendar (GitHub-style) */}
            <div className="bg-card rounded-2xl border border-border/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-4 h-4 text-success" />
                <h3 className="font-semibold text-foreground text-sm">Contributions</h3>
              </div>
              <ContributionCalendar data={contributions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
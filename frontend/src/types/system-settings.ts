export interface AdminToggles {
  updateProfile: boolean;
  changePassword: boolean;
  createAdviserAccount: boolean;
  uploadWhitelist: boolean;
  viewWhitelist: boolean;
  viewSubmissions: boolean;
  searchProjects: boolean;
  archiveProjects: boolean;
  restoreProjects: boolean;
  viewSuggestions: boolean;
  viewArchived: boolean;
  dataAnalyticsView: boolean;
  reportsView: boolean;
  getNotifications: boolean;
}

export interface AdviserToggles {
  updateProfile: boolean;
  changePassword: boolean;
  viewAdvisee: boolean;
  viewProjects: boolean;
  searchProjects: boolean;
  createSuggestion: boolean;
  viewOwnSuggestion: boolean;
  viewOthersSuggestion: boolean;
  viewArchivedSuggestions: boolean;
  archiveOwnSuggestion: boolean;
  returnArchivedSuggestion: boolean;
  dataAnalyticsView: boolean;
  getNotifications: boolean;
}

export interface ProponentToggles {
  updateProfile: boolean;
  changePassword: boolean;
  uploadProjects: boolean;
  getNotifications: boolean;
}

export interface ViewerToggles {
  updateProfile: boolean;
  changePassword: boolean;
  registerAccount: boolean;
  viewAbstract: boolean;
  requestFullAccess: boolean;
  viewSuggestions: boolean;
  dataAnalyticsView: boolean;
  getNotifications: boolean;
}

export interface AllSettings {
  admin: AdminToggles;
  adviser: AdviserToggles;
  proponent: ProponentToggles;
  viewer: ViewerToggles;
}

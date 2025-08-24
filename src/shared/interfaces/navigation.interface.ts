export type NavigationPage = 'home' | 'user';

export interface INavigationState {
    currentPage: NavigationPage;
    setCurrentPage: (page: NavigationPage) => void;
}

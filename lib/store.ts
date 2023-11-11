import {IDocument, IIntegration, ISubscription} from '@/types';
import create from 'zustand';
import {devtools} from 'zustand/middleware';

type AppState = {
    isSidebarOpen: boolean;
    setSidebarOpen: (value: boolean) => void;
    proPlanMonthlyId: string;
    proPlanYearlyId: string;
    showTopBanner: boolean;
    setShowTopBanner: (value: boolean) => void;
};

export const useAppStore = create<AppState>((set) => ({
    proPlanMonthlyId: process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_MONTHLY_ID || '',
    proPlanYearlyId: process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_YEARLY_ID || '',
    isSidebarOpen: false,
    setSidebarOpen: (isSidebarOpen: boolean) => set({isSidebarOpen}),
    showTopBanner: true,
    setShowTopBanner: (showTopBanner: boolean) => set({showTopBanner})
}));

const initialState = {
    name: '',
    type: 'wordpress',
    host: '',
    username: '',
    password: ''
};

type IntegrationState = {
    integration: IIntegration;
    setIntegration: (action: any) => void;
    drawerIsOpen: boolean;
    setDrawerIsOpen: (isOpen: boolean) => void;
    isEditing: boolean;
    setIsEditing: (isEditing: boolean) => void;
};

export const useIntegrationStore = create<IntegrationState>(
    // @ts-ignore
    devtools((set) => ({
        integration: initialState,
        setIntegration: (integration: IIntegration) => set({integration}),
        drawerIsOpen: false,
        setDrawerIsOpen: (drawerIsOpen: boolean) => set({drawerIsOpen}),
        isEditing: false,
        setIsEditing: (isEditing: boolean) => set({isEditing})
    }))
);

type DocDetailState = {
    document: IDocument | null;
    setDocument: (document: IDocument | null) => void;
    documentIsSaving: boolean;
    setDocumentIsSaving: (isSaving: boolean) => void;
    modalMessage: string;
    setModalMessage: (message: string) => void;
    modalTitle: string;
    setModalTitle: (title: string) => void;
    modalIcon: Element | null | React.ReactNode;
    setModalIcon: (icon: Element | null | React.ReactNode) => void;
    isModalOpen: boolean;
    onModalClose: () => void;
    onModalOpen: () => void;
    showSidebar: boolean;
    setShowSidebar: (showSidebar: boolean) => void;
};

export const useDocDetailStore = create<DocDetailState>((set) => ({
    document: null,
    setDocument: (document: IDocument | null) => set({document}),
    documentIsSaving: false,
    setDocumentIsSaving: (documentIsSaving: boolean) => set({documentIsSaving}),
    modalMessage: '',
    setModalMessage: (message: string) => set({modalMessage: message}),
    modalTitle: '',
    setModalTitle: (title: string) => set({modalTitle: title}),
    modalIcon: null,
    setModalIcon: (icon: Element | null | React.ReactNode) =>
        set({modalIcon: icon}),
    isModalOpen: false,
    onModalClose: () => set({isModalOpen: false}),
    onModalOpen: () => set({isModalOpen: true}),
    showSidebar: false,
    setShowSidebar: (showSidebar: boolean) => set({showSidebar})
}));

type LandingState = {
    isModalOpen: boolean;
    onModalClose: () => void;
    onModalOpen: () => void;
    pricingDuration: string;
    setPricingDuration: (duration: string) => void;
};

export const useLandingStore = create<LandingState>(
    // @ts-ignore
    devtools((set) => ({
        isModalOpen: false,
        onModalClose: () => set({isModalOpen: false}),
        onModalOpen: () => set({isModalOpen: true}),
        pricingDuration: 'monthly',
        setPricingDuration: (duration: string) => set({pricingDuration: duration})
    }))
);

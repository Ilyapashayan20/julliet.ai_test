import {createContext, useContext} from 'react';
import {
  useUser as useSupaUser,
  useSessionContext,
  User
} from '@supabase/auth-helpers-react';
import {IUserDetail, ISubscription} from '../../types';
import {
  useSubscribtionByUserId,
  useUserAvailableWordCount,
  useUserDetail
} from '../hooks';

type UserContextType = {
  accessToken: string | null;
  user: User | null;
  userDetail: IUserDetail | null;
  isLoading: boolean;
  subscription: ISubscription | null | undefined;
  wordCount: number;
  hasCredits: boolean;
  isPro: boolean;
  canCreate: boolean;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export interface Props {
  [propName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
  const {
    session,
    isLoading: isLoadingUser,
    supabaseClient: supabase
  } = useSessionContext();
  const user = useSupaUser();
  const accessToken = session?.access_token ?? null;

  const {data: userDetail, isLoading: isLoadingUserDetail} = useUserDetail({
    userId: user?.id as string,
    enabled: !!user?.id
  });

  const {data: subscription, isLoading: isSubscriptionLoading} =
    useSubscribtionByUserId({
      userId: user?.id as string,
      enabled: !!user?.id
    });

  let {data: wordCount, isLoading: isWordCountLoading} =
    useUserAvailableWordCount({
      userId: user?.id as string,
      enabled: !!user
    });

  // Somethimes wordCount is undefined
  wordCount = wordCount ?? 1000;

  let isPro = false;
  if (
    subscription?.subscription_plan_id ==
    (process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_MONTHLY_ID || 805035)
  ) {
    isPro = true;
  }
  if (
    subscription?.subscription_plan_id ==
    (process.env.NEXT_PUBLIC_PADDLE_PLAN_PRO_YEARLY_ID || 810264)
  ) {
    isPro = true;
  }
  if (userDetail?.is_admin) {
    isPro = true;
  }

  const hasCredits = wordCount > 0;
  const canCreate = hasCredits || isPro;

  console.log('availableWordCount', wordCount);
  console.log('canCreate', canCreate);

  const value = {
    accessToken,
    user,
    userDetail,
    isLoading:
      isLoadingUser ||
      isLoadingUserDetail ||
      isSubscriptionLoading ||
      isWordCountLoading,
    subscription,
    hasCredits,
    wordCount,
    isPro,
    canCreate
  };

  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a MyUserContextProvider.`);
  }
  return context;
};

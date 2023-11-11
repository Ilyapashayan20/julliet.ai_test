import { IChatMessage, IDocument, IIntegration } from '@/types';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import {
  UseQueryOptions,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query';
import {
  createChatMessage,
  deleteChatMessagesByTabId,
  getChatMessagesByUserAndTabId,
  getUserChatTabsIds
} from './services/chat';
import {
  deleteDocument,
  generateDocumentContent,
  getDocumentById,
  getDocumentsByUser,
  publishDocument,
  saveDocument,
  updateDocumentTitle
} from './services/documents';
import {
  createIntegration,
  deleteIntegration,
  getIntegrationById,
  getIntegrationsByUser,
  updateIntegration
} from './services/integrations';
import { searchImage } from './services/lexica';
import { getSubscriptionByUserId } from './services/subscriptions';
import { acceptSuggestion } from './services/suggestion';
import {
  getUserAvailableWordCount,
  getUserDetailByUserId,
  saveUserOnboarding,
  saveUserOnboardingPayload,
  setTutorialSeen
} from './services/users';

const supabase = createBrowserSupabaseClient();

interface PaginatedQuery extends UseQueryOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  ascending?: boolean;
  query?: string;
}

export interface useDocumentsByUserProps extends PaginatedQuery {
  userId: string;
}

export const useDocumentsByUser = (props: useDocumentsByUserProps) => {
  const supabase = createBrowserSupabaseClient();

  const { page, pageSize, sortBy, ascending, query, userId, enabled } = props;

  return useQuery({
    enabled,
    keepPreviousData: true,
    queryKey: ['documents'],
    queryFn: () =>
      getDocumentsByUser({
        supabase,
        userId,
        page,
        pageSize,
        sortBy,
        ascending,
        query
      })
  });
};

export interface useDocumentsProps extends UseQueryOptions {
  id: string;
  enabled?: boolean;
}

export const useDocumentById = (props: useDocumentsProps) => {
  const { id, enabled, cacheTime } = props;

  return useQuery({
    enabled,
    queryKey: ['document', id],
    queryFn: () => getDocumentById({ supabase, id }),
    cacheTime
  });
};

export const useLexicaImages = ({
  query,
  enabled = true
}: {
  query: string;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ['searchImage', query],
    queryFn: () => searchImage(query),
    enabled
  });
};

interface useSaveDocumentProps extends UseQueryOptions {
  documentId: number | string;
  data: any;
}

export const useSaveDocument = (props: useSaveDocumentProps) => {
  const queryClient = useQueryClient();

  const { documentId, data } = props;

  return useMutation(() => saveDocument({ supabase, documentId, data }), {
    onSuccess: () => {
      queryClient.invalidateQueries(['document', documentId]);
    }
  });
};

export const useUpdateDocumentTitle = (props: {
  documentId: string;
  title: string;
}) => {
  const queryClient = useQueryClient();

  const { documentId, title } = props;

  const { mutate } = useMutation(
    () => updateDocumentTitle({ supabase, documentId, title }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['document', documentId]);
      }
    }
  );

  return mutate;
};

export interface useSuggestionByPromptProps extends UseQueryOptions {
  documentId: number | string;
  prompt: string;
}

export const useSuggestionByPrompt = (props: useSuggestionByPromptProps) => {
  const queryClient = useQueryClient();
  const { documentId, prompt, enabled } = props;
  return useQuery({
    enabled,
    queryKey: ['suggestion'],
    queryFn: async () => {
      const response = await fetch(`/api/documents/${documentId}/suggestions`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });

      try {
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('success clearing userAvailableWords');
      queryClient.invalidateQueries(['userAvailableWordCount']);
      queryClient.invalidateQueries(['suggestion']);
    }
  });
};

export const useChangeDocumentTitle = ({
  documentId,
  title
}: {
  documentId: string | number;
  title: string;
}) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    () => updateDocumentTitle({ supabase, documentId, title }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['document', documentId]);
      }
    }
  );

  return mutate;
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (documentId: number | string) => deleteDocument({ supabase, documentId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['documents']);
      }
    }
  );
};

export const useAcceptSuggestion = ({ suggestionId }: any) => {
  const queryClient = useQueryClient();

  return useMutation(
    () => {
    
      return fetch('/api/suggesion/accept-suggestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ suggestionId }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['suggestion', suggestionId]);
      },
    }
  );
};

export const useUserAvailableWordCount = ({
  userId,
  enabled
}: {
  userId: string;
  enabled: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: ['userAvailableWordCount'],
    queryFn: () => getUserAvailableWordCount({ supabase, userId })
  });
};

interface useGetChatMessagesByUserIdProps extends PaginatedQuery {
  userId: string;
  tabId: string;
}

export const useGetChatMessagesByUserAndTabId = (
  props: useGetChatMessagesByUserIdProps
) => {
  const { userId, tabId, page, pageSize, sortBy, ascending, query, enabled } =
    props;

  return useQuery({
    enabled,
    queryKey: ['chatMessages', tabId],
    queryFn: () =>
      getChatMessagesByUserAndTabId({
        supabase,
        userId,
        tabId,
        page,
        pageSize,
        sortBy,
        ascending,
        query
      })
  });
};

export const useCreateChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: IChatMessage) => createChatMessage({ supabase, payload }),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['chatMessages', data.tab_id]);
        queryClient.invalidateQueries(['userChatTabIds']);
      }
    }
  );
};

export interface createIntegrationProps {
  payload: IIntegration;
}

export const useCreateIntegration = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (props: createIntegrationProps) =>
      createIntegration({ supabase, ...props }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['integrations']);
      }
    }
  );

  return mutate;
};

export interface useIntegrationsByUserProps extends PaginatedQuery {
  userId: string;
}

export const useGetIntegrationsByUser = (props: useIntegrationsByUserProps) => {
  const { page, pageSize, sortBy, ascending, query, userId, enabled } = props;

  return useQuery({
    enabled,
    queryKey: ['integrations'],
    queryFn: () =>
      getIntegrationsByUser({
        supabase,
        page,
        pageSize,
        sortBy,
        ascending,
        query,
        userId
      })
  });
};

export function useDeleteIntegration() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (integrationId: string | number) =>
      deleteIntegration({ supabase, integrationId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['integrations']);
      }
    }
  );

  return mutate;
}

export function useIntegrationById({
  integrationId,
  enabled
}: {
  integrationId: string | number;
  enabled: boolean;
}) {
  return useQuery({
    enabled,
    queryKey: ['integration', integrationId],
    queryFn: () => getIntegrationById({ supabase, integrationId })
  });
}

export function useUpdateIntegration() {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (payload: IIntegration) => updateIntegration({ supabase, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['integrations']);
      }
    }
  );

  return mutate;
}

interface PublishDocumentProps {
  documentId: string | number;
  integrationId: string | number;
  status?: 'publish' | 'draft' | 'private' | 'pending' | 'future';
  publishDate?: Date;
}

export function usePublishDocument() {
  const queryClient = useQueryClient();

  return useMutation(
    (props: PublishDocumentProps) => publishDocument({ supabase, ...props }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['documents']);
      },
      onError: (error) => {
        console.error(error);
      }
    }
  );
}

export const useCreateDocumentByFetch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (props: any) => {
      const response = await fetch('/api/documents', {
        method: 'POST',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(props)
      });

      try {
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
    }
  });
};

export const useSubscribtionByUserId = ({
  userId,
  enabled
}: {
  userId: string;
  enabled: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: ['subscription', userId],
    queryFn: () => getSubscriptionByUserId({ supabase, userId }),
    refetchOnWindowFocus: false
  });
};

export const useGenerateDocumentContent = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ doc }: { doc: IDocument; userId: string }) =>
      generateDocumentContent({ supabase, doc }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['documents']);
      }
    }
  );
};

export const useGetUserChatTabIds = ({
  userId,
  enabled,
  search = null
}: {
  userId: string;
  enabled: boolean;
  search?: string | null;
}) => {
  return useQuery({
    enabled,
    queryKey: ['userChatTabIds', search],
    queryFn: () => getUserChatTabsIds({ supabase, userId, search })
  });
};

export const useDeleteChatMessagesByTabId = ({
  tabId,
  userId
}: {
  tabId: string;
  userId: string;
}) => {
  const queryClient = useQueryClient();

  return useMutation(
    () => deleteChatMessagesByTabId({ supabase, userId, tabId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['chatMessages', tabId]);
        queryClient.invalidateQueries(['userChatTabIds']);
      }
    }
  );
};

export const useUserDetail = ({
  userId,
  enabled
}: {
  userId: string;
  enabled: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: ['userDetails'],
    queryFn: () => getUserDetailByUserId({ supabase, userId })
  });
};

export const useSetTutorialSeen = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (userId: string) => setTutorialSeen({ supabase, userId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userDetails']);
      }
    }
  );
};

export const useSaveUserOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: saveUserOnboardingPayload) =>
      saveUserOnboarding({ supabase, payload }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userDetails']);
      }
    }
  );
};

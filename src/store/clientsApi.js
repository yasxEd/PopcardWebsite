import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// DiceBear avatar helper (notionists style, as requested)
export const getDiceBearAvatar = (client) => {
  const seed = encodeURIComponent(client.email || client.name || Math.random().toString(36).substring(2));
  return `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,e0e7ff&hair=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10&hairColor=0e0e0e,6b46c1,374151,991b1b,059669,dc2626&shirt=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08&shirtColor=1f2937,374151,6366f1,059669,dc2626,f59e0b`;
};

// Load from localStorage if available
const loadClients = () => {
  try {
    const data = localStorage.getItem('clients');
    if (data) {
      // Add avatar to each client if missing
      return JSON.parse(data).map(client => ({
        ...client,
        avatar: client.avatar || getDiceBearAvatar(client)
      }));
    }
  } catch {}
  return [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      points: 250,
      totalVisits: 12,
      dateCreated: '2024-01-15',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=john.doe.1&backgroundColor=b6e3f4,c0aede,d1d4f9,e0e7ff&hair=variant01&hairColor=374151&shirt=variant01&shirtColor=6366f1',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891',
      points: 180,
      totalVisits: 8,
      dateCreated: '2024-02-20',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=jane.smith.2&backgroundColor=b6e3f4,c0aede,d1d4f9,e0e7ff&hair=variant02&hairColor=6b46c1&shirt=variant02&shirtColor=dc2626',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1234567892',
      points: 320,
      totalVisits: 15,
      dateCreated: '2024-01-10',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=bob.johnson.3&backgroundColor=b6e3f4,c0aede,d1d4f9,e0e7ff&hair=variant03&hairColor=991b1b&shirt=variant03&shirtColor=f59e0b',
    },
  ];
};

let mockClients = loadClients();

const saveClients = () => {
  localStorage.setItem('clients', JSON.stringify(mockClients));
};

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/', // Mock base URL
  }),
  tagTypes: ['Client'],
  endpoints: (builder) => ({
    getClients: builder.query({
      queryFn: () => ({
        data: mockClients.map(client => ({
          ...client,
          avatar: client.avatar || getDiceBearAvatar(client)
        }))
      }),
      providesTags: ['Client'],
    }),
    addClient: builder.mutation({
      queryFn: (newClient) => {
        const id = Math.max(...mockClients.map(c => c.id), 0) + 1;
        const client = {
          ...newClient,
          id,
          points: typeof newClient.points === 'number' ? newClient.points : 0,
          totalVisits: typeof newClient.totalVisits === 'number' ? newClient.totalVisits : 0,
          dateCreated: newClient.dateCreated
            ? newClient.dateCreated.split('T')[0]
            : new Date().toISOString().split('T')[0],
          avatar: getDiceBearAvatar(newClient),
        };
        mockClients.push(client);
        saveClients();
        return { data: client };
      },
      invalidatesTags: ['Client'],
    }),
    updateClient: builder.mutation({
      queryFn: (updatedClient) => {
        const index = mockClients.findIndex(c => c.id === updatedClient.id);
        if (index !== -1) {
          // Always use updated fields from payload, and normalize dateCreated
          mockClients[index] = {
            ...mockClients[index],
            ...updatedClient,
            id: mockClients[index].id, // Ensure ID is not changed
            dateCreated: updatedClient.dateCreated
              ? updatedClient.dateCreated.split('T')[0]
              : mockClients[index].dateCreated,
            points: typeof updatedClient.points === 'number' ? updatedClient.points : mockClients[index].points,
            totalVisits: typeof updatedClient.totalVisits === 'number' ? updatedClient.totalVisits : mockClients[index].totalVisits,
            avatar: getDiceBearAvatar(updatedClient),
          };
          saveClients();
          mockClients = JSON.parse(JSON.stringify(mockClients));
          return { data: { ...mockClients[index] } };
        }
        return { error: 'Client not found' };
      },
      invalidatesTags: ['Client'],
    }),
    deleteClient: builder.mutation({
      queryFn: (id) => {
        mockClients = mockClients.filter(c => c.id !== id);
        saveClients();
        return { data: id };
      },
      invalidatesTags: ['Client'],
    }),
    getClientById: builder.query({
      queryFn: (id) => {
        const client = mockClients.find(c => c.id === parseInt(id));
        if (client) {
          return { data: { ...client, avatar: client.avatar || getDiceBearAvatar(client) } };
        }
        return { error: 'Client not found' };
      },
    }),
    addPointsToClient: builder.mutation({
      queryFn: ({ id, points }) => {
        const client = mockClients.find(c => c.id === parseInt(id));
        if (client) {
          client.points += points;
          client.totalVisits += 1;
          saveClients();
          return { data: client };
        }
        return { error: 'Client not found' };
      },
      invalidatesTags: ['Client'],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetClientByIdQuery,
  useAddPointsToClientMutation,
} = clientsApi;
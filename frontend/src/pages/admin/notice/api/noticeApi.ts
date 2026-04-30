import { api } from '@/api/axios'

export async function getRecentNoticeRequests() {
  
  const res = await api.get('/api/admin/notices', {
    params: {
      page: 1,
      size: 100,
    },
  })

  return res.data.data.items
}

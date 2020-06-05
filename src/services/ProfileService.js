import Api from '@/services/Api'

export default {
  index () {
    return Api().get('profiles')
  },
  show (profileId) {
    return Api().get(`profiles/${profileId}`)
  },
  update (profile) {
    return Api().put(`profiles/${profile.id}`, profile)
  }
}

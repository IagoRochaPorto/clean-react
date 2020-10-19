import { SaveAccessToken } from '@/domain/usecases/save-access-token'

export class SaveAcessTokenMock implements SaveAccessToken {
  accesstoken: string
  async save(accessToken: string): Promise<void> {
    this.accesstoken = accessToken
  }
}

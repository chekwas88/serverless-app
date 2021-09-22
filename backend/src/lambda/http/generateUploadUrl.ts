import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getUploadUrl, updateUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    // // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

    const userId = getUserId(event)
    const Url = await getUploadUrl(todoId)
    const attachmentId = Url.split('?')[0]

    await updateUrl(userId, todoId, attachmentId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: Url
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)

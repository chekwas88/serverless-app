import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../dataLayer/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('todos')

export const getTodos = async (userId: string): Promise<TodoItem[]> => {
  logger.info(`Getting todos for user ${userId}`)

  return await todosAccess.getTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info(`Creating todo for user ${userId}`)
  const todoId = uuid.v4()

  return await todosAccess.createTodo({
    todoId: todoId,
    userId: userId,
    done: false,
    attachmentUrl: '',
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate
  })
}

export const getTodo = async (
  todoId: string,
  userId: string
): Promise<TodoItem> => {
  logger.info(`Getting todo ${todoId}`)

  return await todosAccess.getTodo(todoId, userId)
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updateTodoRequest: UpdateTodoRequest
) {
  logger.info(`Update todo ${todoId} for user ${userId}`)
  const item = await todosAccess.getTodo(todoId, userId)

  if (item.userId !== userId) {
    logger.error('Authorization denied, you do not own this todo')
    throw new Error('Update denied')
  }

  return await todosAccess.updateTodo(todoId, updateTodoRequest, userId)
}

export async function updateUrl(
  userId: string,
  todoId: string,
  attachmentURL: string
) {
  logger.info(`Updating URL with ${attachmentURL} for user ${userId}`)

  const item = await todosAccess.getTodo(todoId, userId)

  if (item.userId !== userId) {
    logger.error('Authorization denied, you do not own this todo')
    throw new Error('URL update denied')
  }

  return await todosAccess.updateUrl(todoId, attachmentURL, userId)
}

export async function deleteTodo(userId: string, todoId: string) {
  logger.info(`Deleting ${todoId} from user ${userId}`)

  const item = await todosAccess.getTodo(todoId, userId)

  if (item.userId !== userId) {
    logger.error('Authorization denied, you do not own this todo')
    throw new Error('Deletion denied')
  }

  return await todosAccess.deleteTodo(todoId, userId)
}

export const getUploadUrl = (attachmentId: string) =>
  attachmentUtils.getUploadUrl(attachmentId)

export const getAttachmentUrl = (attachmentId: string) =>
  attachmentUtils.getAttachmentUrl(attachmentId)

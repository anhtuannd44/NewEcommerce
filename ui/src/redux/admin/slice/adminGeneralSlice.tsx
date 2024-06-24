import { createSlice } from '@reduxjs/toolkit'
import { getOrderAttributeList, getOrderOriginList, getProductList, getUserList, createOrUpdateOrigin, getOrderTagList } from 'src/api/order'
import { MessageType } from 'src/common/enums'
import { SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT } from 'src/common/constants'
import { IAdminGeneralState, IRequestStatus } from '../interface/IAdminGeneralState'

const initRequestStatus: IRequestStatus = {
  isLoading: false,
  isSentRequest: false,
  isSuccess: false,
  isSubmitted: false
}

const initialState: IAdminGeneralState = {
  userList: {
    status: initRequestStatus
  },
  productList: {
    status: initRequestStatus
  },
  orderOriginList: {
    status: initRequestStatus
  },
  orderAttributeList: {
    status: initRequestStatus
  },
  orderTagList: {
    status: initRequestStatus
  },
  message: { type: MessageType.Success, text: '' }
}

const adminGeneralSlice = createSlice({
  name: 'adminGeneralSlice',
  initialState,
  reducers: {
    createOrUpdateOriginList: (state, action) => {
      if (state.orderOriginList.orderOrigins) {
        const index = state.orderOriginList.orderOrigins.findIndex(x => x.id === action.payload.id)
        console.log(index)
        if (index !== -1) {
          state.orderOriginList.orderOrigins[index] = action.payload
        } else {
          state.orderOriginList.orderOrigins.push(action.payload)
        }
      }
    }
  },
  extraReducers: builder => {
    builder
      //get user list
      .addCase(getUserList.pending, state => {
        state.userList.status.isLoading = true
        state.userList.status.isSentRequest = true
        state.userList.status.isSuccess = false
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.userList.status.isLoading = false
        state.userList.status.isSentRequest = false
        state.userList.status.isSuccess = true
        state.userList.users = action.payload.data
        state.message.type = MessageType.Success
        state.message.text = action.payload.message || SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.userList.status.isLoading = false
        state.userList.status.isSentRequest = false
        state.userList.status.isSuccess = false
        state.message.type = MessageType.Success
        state.message.text = action.payload as string
      })
      // get Product List
      .addCase(getProductList.pending, state => {
        state.productList.status.isLoading = true
        state.productList.status.isSentRequest = true
        state.productList.status.isSuccess = false
      })
      .addCase(getProductList.fulfilled, (state, action) => {
        state.productList.status.isLoading = false
        state.productList.status.isSentRequest = false
        state.productList.status.isSuccess = true
        state.productList.products = action.payload.data
        state.message.type = MessageType.Success
        state.message.text = action.payload.message || SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT
      })
      .addCase(getProductList.rejected, (state, action) => {
        state.productList.status.isLoading = false
        state.productList.status.isSentRequest = false
        state.productList.status.isSuccess = false
        state.message.type = MessageType.Success
        state.message.text = action.payload as string
      })
      // Get product attribute list
      .addCase(getOrderAttributeList.pending, state => {
        state.orderAttributeList.status.isLoading = true
        state.orderAttributeList.status.isSentRequest = true
        state.orderAttributeList.status.isSuccess = false
      })
      .addCase(getOrderAttributeList.fulfilled, (state, action) => {
        state.orderAttributeList.status.isLoading = false
        state.orderAttributeList.status.isSentRequest = false
        state.orderAttributeList.status.isSuccess = true
        state.orderAttributeList.orderAttributes = action.payload.data
        state.orderAttributeList.total = action.payload.total
        state.message.type = MessageType.Success
        state.message.text = action.payload.message || SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT
      })
      .addCase(getOrderAttributeList.rejected, (state, action) => {
        state.orderAttributeList.status.isLoading = false
        state.orderAttributeList.status.isSentRequest = false
        state.orderAttributeList.status.isSuccess = false
        state.message.type = MessageType.Success
        state.message.text = action.payload as string
      })
      // Get origin list
      .addCase(getOrderOriginList.pending, state => {
        state.orderOriginList.status.isLoading = true
        state.orderOriginList.status.isSentRequest = true
        state.orderOriginList.status.isSuccess = false
      })
      .addCase(getOrderOriginList.fulfilled, (state, action) => {
        state.orderOriginList.status.isLoading = false
        state.orderOriginList.status.isSentRequest = false
        state.orderOriginList.status.isSuccess = true
        state.orderOriginList.orderOrigins = action.payload.data
        state.orderOriginList.total = action.payload.total
        state.message.type = MessageType.Success
        state.message.text = action.payload.message || SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT
      })
      .addCase(getOrderOriginList.rejected, (state, action) => {
        state.orderOriginList.status.isLoading = false
        state.orderOriginList.status.isSentRequest = false
        state.orderOriginList.status.isSuccess = false
        state.message.type = MessageType.Success
        state.message.text = action.payload as string
      })
      // Get origin list
      .addCase(getOrderTagList.pending, state => {
        state.orderTagList.status.isLoading = true
        state.orderTagList.status.isSentRequest = true
        state.orderTagList.status.isSuccess = false
      })
      .addCase(getOrderTagList.fulfilled, (state, action) => {
        state.orderTagList.status.isLoading = false
        state.orderTagList.status.isSentRequest = false
        state.orderTagList.status.isSuccess = true
        state.orderTagList.orderTags = action.payload.data
        state.message.type = MessageType.Success
        state.message.text = action.payload.message || SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT
      })
      .addCase(getOrderTagList.rejected, (state, action) => {
        state.orderTagList.status.isLoading = false
        state.orderTagList.status.isSentRequest = false
        state.orderTagList.status.isSuccess = false
        state.message.type = MessageType.Success
        state.message.text = action.payload as string
      })
			// create or update order origin
      .addCase(createOrUpdateOrigin.pending, state => {
        state.orderOriginList.status.isLoading = true
        state.orderOriginList.status.isSentRequest = true
        state.orderOriginList.status.isSuccess = false
      })
      .addCase(createOrUpdateOrigin.fulfilled, (state, action) => {
        state.orderOriginList.status.isLoading = false
        state.orderOriginList.status.isSentRequest = false
        state.orderOriginList.status.isSuccess = true
        state.orderOriginList.orderOrigins?.push(action.payload)
        state.message.type = MessageType.Success
        state.message.text = action.payload.message || SUCCESS_MESSAGE_CREATE_UPDATE_DEFAULT
      })
      .addCase(createOrUpdateOrigin.rejected, (state, action) => {
        state.orderOriginList.status.isLoading = false
        state.orderOriginList.status.isSentRequest = false
        state.orderOriginList.status.isSuccess = false
        state.message.type = MessageType.Success
        state.message.text = action.payload as string
      })
  }
})

export const { createOrUpdateOriginList } = adminGeneralSlice.actions

const adminGeneralReducer = adminGeneralSlice.reducer

export default adminGeneralReducer

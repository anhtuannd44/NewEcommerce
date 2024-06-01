'use client'
import { connect } from 'react-redux'

import { ChangeEvent, forwardRef, useEffect, useState } from 'react'
import {
	Autocomplete,
	Avatar,
	Badge,
	Box,
	Button,
	CardContent,
	Divider,
	TextField,
	Typography,
	createFilterOptions,
	Grid,
	Link,
	Card,
	CardHeader,
	styled,
	FormHelperText,
	FormControl
} from '@mui/material'

import { Magnify, OilTemperature } from 'mdi-material-ui'

import ProductBorrowInfo, { IProductBorrowProps } from 'src/views/admin/order/ProductBorrowInfo'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import OrderDetailsBox from 'src/views/admin/order/OrderDetailsBox'
import EmptyBox from 'src/views/shared/EmptyBox'
import {
	IOrderAdminState,
	IOrderItemRequest,
	IOrderProductDataItem,
	IOrderRequest,
	IOrderRequestBody,
	IOrderTypesSelection,
	IProductItemRequestBody,
	IProductSelection,
	IUserSelection,
	IValidationRequest
} from 'src/redux/admin/interface/IOrderAdmin'
import {
	getDataProductCreate,
	handleChangeCustomer,
	handleSelectCustomer,
	handleUpdateStateProductSelected,
	handleOnProductInputChange,
	handleUpdateOrderRequest,
	handleSelectPicUser,
	handleSelectConstructionUser,
	createOrder
} from 'src/redux/admin/actions/orderAdminAction'
import { IRootState } from 'src/redux/reducer'
import { currencyVNDFormatter } from 'src/utils/formatCurrency'
import TotalBoxDetail from 'src/views/admin/order/TotalBoxDetail'
import { IValidationRules, checkValidity } from 'src/utils/utility'
import { Dispatch } from 'redux'
import { redirect, useParams } from 'next/navigation'
import { useRouter } from 'next/router'

const BadgeContentSpan = styled('span')(({ theme }) => ({
	width: 8,
	height: 8,
	borderRadius: '50%',
	backgroundColor: theme.palette.success.main,
	boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const CustomInputs = forwardRef((props, ref) => {
	return <TextField inputRef={ref} label='Ngày hẹn giao' fullWidth size='small' {...props} />
})

interface IOrderAdminPageProps {
	state: IOrderAdminState
	getDataProductCreate: (id?: string) => void
	handleChangeCustomer: () => void
	handleSelectCustomer: (customer: IUserSelection, newState: IOrderRequest) => void
	handleUpdateStateProductSelected: (newState: IOrderProductDataItem[], newOrderRequestState: IOrderRequest) => void
	handleOnProductInputChange: (value: string) => void
	handleSelectPicUser: (newValue: IUserSelection | null, newState: IOrderRequest) => void
	handleSelectConstructionUser: (newValue: IUserSelection | null, newState: IOrderRequest) => void
	handleUpdateOrderRequest: (newState: IOrderRequest) => void
	createOrder: (data: IOrderRequestBody) => void
}

const OrderAdminPage = (props: IOrderAdminPageProps) => {
	const {
		state,
		getDataProductCreate,
		handleChangeCustomer,
		handleSelectCustomer,
		handleUpdateStateProductSelected,
		handleOnProductInputChange,
		handleUpdateOrderRequest,
		handleSelectPicUser,
		handleSelectConstructionUser,
		createOrder
	} = props
	const {
		usersSelection,
		productsSelection,
		productInputText,
		orderRequest,
		orderProductData,
		orderTypesSelection,
		isCreateSuccess,
		id
	} = state

	const router = useRouter()
	const { slug } = router.query

	useEffect(() => {
		if (slug) {
			getDataProductCreate(typeof slug !== 'string' ? slug[0] : slug.toString())
		}
	}, [slug])

	useEffect(() => {
		if (isCreateSuccess) {
			redirect(`/order/detail?id=${id}`)
		}
	}, [isCreateSuccess])

	const filterUserOptions = createFilterOptions({
		stringify: (option: IUserSelection) => `${option.fullName} ${option.email} ${option.phoneNumber}`
	})

	const filterProductOption = createFilterOptions({
		stringify: (option: IProductSelection) => `${option.title} ${option.sku}`
	})

	const handleOnChangeSelectUser = (value: IUserSelection | null) => {
		if (value) {
			handleSelectCustomer(value, { ...orderRequest })
		}
	}

	const handleOnChangeSelectProduct = (value: IProductSelection | null) => {
		if (value) {
			const newProductDataDetails = orderProductData ? [...orderProductData] : []

			const newOrderItemRequest: IOrderItemRequest[] = []

			let isExistedInList = false

			let newPrductDataDetailsWithSort: IOrderProductDataItem[] = []

			if (orderProductData && orderProductData.length > 0) {
				newPrductDataDetailsWithSort = setNewOrderId(newProductDataDetails)

				newPrductDataDetailsWithSort.map(item => {
					if (item.id == value.id) {
						item.quantity = item.quantity + 1
						isExistedInList = true
					}
					return item
				})
			}

			if (!isExistedInList) {
				const valueInputToList: IOrderProductDataItem = {
					orderNumber:
						newPrductDataDetailsWithSort.length > 0
							? newPrductDataDetailsWithSort[newPrductDataDetailsWithSort.length - 1].orderNumber++
							: 1,
					id: value.id,
					imgUrl: undefined,
					productName: value.title,
					productCode: value.sku,
					productUrl: '/',
					price: value.price,
					quantity: 1,
					discount: 0,
					discountType: 'value',
					total: 0,
					discountPercent: 0,
					note: {
						isShow: false,
						value: ''
					}
				}
				newPrductDataDetailsWithSort.push(valueInputToList)
			}

			newPrductDataDetailsWithSort.map(item => {
				const itemTotalWithoutDiscount = item.price * item.quantity
				const itemTotal =
					itemTotalWithoutDiscount -
					(item.discountType == 'value' ? item.discount : (itemTotalWithoutDiscount / 100) * item.discount)
				item.total = itemTotal
				item.discountPercent =
					item.discountType == 'percent' ? item.discount : (item.discount / itemTotalWithoutDiscount) * 100

				newOrderItemRequest.push({
					productId: {
						validation: {
							required: true
						},
						value: item.id,
						result: {
							isValid: true,
							errorMessage: ''
						}
					},
					price: {
						validation: {
							required: true
						},
						value: item.price,
						result: {
							isValid: true,
							errorMessage: ''
						}
					},
					quantity: {
						validation: {
							required: true,
							minNumber: 1
						},
						value: item.quantity,
						result: {
							isValid: true,
							errorMessage: ''
						}
					},
					discountType: {
						validation: {
							required: true
						},
						value: item.discountType,
						result: {
							isValid: true,
							errorMessage: ''
						}
					},
					discount: {
						validation: {
							required: true
						},
						value: item.discount,
						result: {
							isValid: true,
							errorMessage: ''
						}
					},
					note: {
						validation: {
							required: false
						},
						value: item.note?.value,
						result: {
							isValid: true,
							errorMessage: ''
						}
					}
				})
				return item
			})

			handleUpdateStateProductSelected(newPrductDataDetailsWithSort, {
				...orderRequest,
				items: newOrderItemRequest
			})
		}
	}

	const setNewOrderId = (list: IOrderProductDataItem[]) => {
		const newPrductDataDetailsWithSort = list.sort((n1, n2) => n1.orderNumber - n2.orderNumber)

		let orderNumber = 1
		newPrductDataDetailsWithSort.map(item => {
			item.orderNumber = orderNumber
			orderNumber++
			return item
		})

		return newPrductDataDetailsWithSort
	}

	const handlePicUserSelected = (value: IUserSelection | null) => {
		handleSelectPicUser(value, { ...orderRequest })
	}

	const handleOnChangeSelectConstructionStaff = (value: IUserSelection | null) => {
		handleSelectConstructionUser(value, { ...orderRequest })
	}

	const handleDeliveryDateChange = (date: Date | null | undefined) => {
		const newState: IOrderRequest = {
			...orderRequest,
			controls: {
				...orderRequest.controls,
				deliveryDate: {
					...orderRequest.controls.deliveryDate,
					value: date
				}
			}
		}
		handleUpdateOrderRequest(newState)
	}

	const handleOrderCodeChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const value = event.target.value || ''

		const newState: IOrderRequest = {
			...orderRequest,
			controls: {
				...orderRequest.controls,
				orderCode: {
					...orderRequest.controls.orderCode,
					value: value
				}
			}
		}
		handleUpdateOrderRequest(newState)
	}

	const handleOnChangeOrderType = (value: IOrderTypesSelection | null | undefined) => {
		let isComplain = false
		if (value && value.name === 'Đơn khiếu nại') {
			isComplain = true
		}
		const newState: IOrderRequest = {
			...orderRequest,
			controls: {
				...orderRequest.controls,
				orderType: {
					...orderRequest.controls.orderType,
					value: value?.id || ''
				}
			},
			isComplain: isComplain
		}
		handleUpdateOrderRequest(newState)
	}

	const handleValidateItem = (value: any, fieldName: keyof typeof orderRequest.controls, rules: IValidationRules) => {
		const newState = { ...orderRequest }
		const validationRs = checkValidity(value.value, rules)
		const key: keyof typeof orderRequest.controls = fieldName
		newState.controls[key].result = validationRs
		handleUpdateOrderRequest(newState)
	}

	const handleValidationRequest = (): boolean => {
		let isValid = true

		const newState = { ...orderRequest }

		for (const [field, value] of Object.entries({ ...orderRequest.controls })) {
			const rules = value.validation
			const validationRs = checkValidity(value.value, rules)

			const key: keyof typeof orderRequest.controls = field as keyof typeof orderRequest.controls
			newState.controls[key].result = validationRs

			if (!validationRs.isValid) {
				isValid = false
			}
		}
		const items = orderRequest.items ? [...orderRequest.items] : []

		if (items && items.length > 0) {
			items.map((item: IOrderItemRequest) => {
				for (const [field, value] of Object.entries(item)) {
					const validationRs = checkValidity(value.value, value.validation)
					const key: keyof typeof item = field as keyof typeof item
					item[key].result = validationRs
					if (!validationRs.isValid) {
						isValid = false
					}
				}
				return item
			})
			newState.items = items
		} else {
			isValid = false
		}

		handleUpdateOrderRequest(newState)

		return isValid
	}

	const handleProblemChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		target: 'problem' | 'rootCause' | 'solution'
	) => {
		const newState: IOrderRequest = {
			...orderRequest,
			problem: target == 'problem' ? event.target.value : orderRequest.problem,
			rootCause: target == 'rootCause' ? event.target.value : orderRequest.rootCause,
			solution: target == 'solution' ? event.target.value : orderRequest.solution
		}
		handleUpdateOrderRequest(newState)
	}

	const handleSubmit = () => {
		const isValidData = handleValidationRequest()
		if (isValidData) {
			const items: IProductItemRequestBody[] = []

			orderRequest.items?.forEach(item => {
				items.push({
					productId: item.productId.value || '',
					price: item.price.value || 0,
					quantity: item.quantity.value || 0,
					discountType: item.DiscountType.Value || 'value',
					discount: item.discount.value || 0,
					note: item.note.value || ''
				})
			})

			const requestControls = orderRequest.controls
			const requestBody: IOrderRequestBody = {
				userId: requestControls.userId.value || '',
				deliveryAddress: requestControls.deliveryAddress.value || '',
				billingAddress: requestControls.billingAddress.value || '',
				PICStaffId: requestControls.PICStaffId.value || '',
				deliveryDate: requestControls.deliveryDate.value || null,
				constructionStaffId: requestControls.constructionStaffId.value || '',
				preTotal: requestControls.preTotal.value || 0,
				total: requestControls.total.value || 0,
				shippingFee: requestControls.shippingFee.value || 0,
				orderType: requestControls.orderType.value || '',
				orderDiscount: {
					type: orderRequest.orderDiscount.type,
					value: orderRequest.orderDiscount.value,
					note: orderRequest.orderDiscount.note
				},
				orderCode: requestControls.orderCode.value || '',
				note: requestControls.note.value || '',
				items: items,
				isComplain: orderRequest.isComplain,
				problem: orderRequest.problem,
				rootCause: orderRequest.rootCause,
				solution: orderRequest.solution,
				fixingCost: orderRequest.fixingCost,
				responsibleStaffId: orderRequest.responsibleStaffId
			}

			createOrder(requestBody)
		}
	}

	const productBorrowInfo: IProductBorrowProps = {
		borrow: '1',
		totalPay: '2',
		returnOrder: '3',
		shippingFail: '4'
	}

	return (
		<>
			{usersSelection && orderTypesSelection && orderRequest.controls.userId.value && (
				<Grid container spacing={6} mb={5}>
					<Grid item xs={9}>
						<Card>
							<CardHeader title='Thông tin khách hàng' titleTypographyProps={{ variant: 'h6' }} />
							<Divider sx={{ margin: 0 }} />
							<CardContent
								sx={{
									height: 450,
									overflowY: 'auto'
								}}>
								<Grid container spacing={12}>
									<Grid item xs={12}>
										{orderRequest.controls.userId.value ? (
											<>
												<Box mb={4}>
													<Typography sx={{ fontSize: '1rem' }}>
														<Link
															color='primary'
															href={`admin/user/${orderRequest.controls.userId.value}`}>
															{
																usersSelection?.find(
																	x => x.id === orderRequest.controls.userId.value
																)?.fullName
															}
														</Link>{' '}
														-{' '}
														{
															usersSelection?.find(
																x => x.id === orderRequest.controls.userId.value
															)?.phoneNumber
														}{' '}
														{usersSelection?.find(
															x => x.id === orderRequest.controls.userId.value
														)?.email &&
															`- ${
																usersSelection?.find(
																	x => x.id === orderRequest.controls.userId.value
																)?.email
															}`}
													</Typography>
												</Box>
												<Grid container spacing={5} mb={4}>
													<Grid item xs={8}>
														<Box
															component='section'
															sx={{
																p: 2,
																mb: 5,
																border: '1px dashed grey',
																borderRadius: 2
															}}>
															<Typography variant='h6' mb={2} sx={{ fontWeight: 500 }}>
																ĐỊA CHỈ GIAO HÀNG
															</Typography>
															<Typography variant='body1' mb={3}>
																{
																	usersSelection?.find(
																		x => x.id === orderRequest.controls.userId.value
																	)?.address
																}
															</Typography>
															<Button variant='contained' size='small' color='warning'>
																Thay đổi
															</Button>
														</Box>
														<Box
															component='section'
															sx={{
																p: 2,
																mb: 5,
																border: '1px dashed grey',
																borderRadius: 2
															}}>
															<Typography variant='h6' mb={2} sx={{ fontWeight: 500 }}>
																ĐỊA CHỈ NHẬN HÓA ĐƠN
															</Typography>
															<Typography variant='body1' mb={3}>
																{
																	usersSelection?.find(
																		x => x.id === orderRequest.controls.userId.value
																	)?.address
																}
															</Typography>
															<Button variant='contained' size='small' color='warning'>
																Thay đổi
															</Button>
														</Box>
													</Grid>
													<Grid item xs={4}>
														<Box
															component='section'
															sx={{
																px: 4,
																py: 0,
																mb: 5,
																border: '1px dashed grey',
																borderRadius: 2
															}}>
															<ProductBorrowInfo {...productBorrowInfo} />
														</Box>
													</Grid>
												</Grid>
												<Grid container>
													<Grid item xs={12} textAlign='center'>
														<Button
															variant='contained'
															size='small'
															onClick={() => {
																handleChangeCustomer()
															}}>
															Chọn lại khác hàng
														</Button>
													</Grid>
												</Grid>
											</>
										) : (
											<>
												<Autocomplete
													fullWidth
													id='customeSelection'
													options={usersSelection}
													renderInput={params => (
														<FormControl
															error={!orderRequest.controls.userId.result.isValid}
															variant='standard'
															fullWidth>
															<TextField
																{...params}
																error={!orderRequest.controls.userId.result.isValid}
																label='Tìm theo tên, SĐT hoặc Mã khách hàng ...'
																InputProps={{
																	...params.InputProps,
																	startAdornment: (
																		<Magnify
																			color='action'
																			style={{ marginRight: '8px' }}
																		/>
																	)
																}}
															/>
															<FormHelperText>
																{orderRequest.controls.userId.result.errorMessage}
															</FormHelperText>
														</FormControl>
													)}
													onChange={(event, newValue, reason) => {
														if (
															event.type === 'keydown' &&
															((event as React.KeyboardEvent).key === 'Backspace' ||
																(event as React.KeyboardEvent).key === 'Delete') &&
															reason === 'removeOption'
														) {
															return
														}
														handleOnChangeSelectUser(newValue)
													}}
													filterOptions={filterUserOptions}
													getOptionLabel={option => option.fullName}
													renderOption={(props, option) => (
														<li {...props}>
															<Badge
																overlap='circular'
																badgeContent={<BadgeContentSpan />}
																anchorOrigin={{
																	vertical: 'bottom',
																	horizontal: 'right'
																}}>
																<Avatar
																	alt='John Doe'
																	src='/images/avatars/1.png'
																	sx={{ width: '2.5rem', height: '2.5rem' }}
																/>
															</Badge>
															<Box
																sx={{
																	display: 'flex',
																	marginLeft: 3,
																	alignItems: 'flex-start',
																	flexDirection: 'column'
																}}>
																<Typography sx={{ fontWeight: 600 }}>
																	{option.fullName}
																</Typography>
																<Typography
																	variant='body2'
																	sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
																	{option.phoneNumber}
																</Typography>
															</Box>
														</li>
													)}
												/>
												<Box pt={5} textAlign='center'>
													<EmptyBox />
													<Typography variant='body2'>
														Vui lòng chọn thông tin khác hàng
													</Typography>
												</Box>
											</>
										)}
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>
					<Grid item xs={3}>
						<Card>
							<CardHeader title='Thông tin bổ sung' titleTypographyProps={{ variant: 'h6' }} />
							<Divider sx={{ margin: 0 }} />
							<CardContent
								sx={{
									height: '450px',
									overflowY: 'auto'
								}}>
								<form
									onSubmit={e => {
										e.preventDefault()
										handleSubmit()
									}}>
									<Grid container spacing={5}>
										<Grid item xs={12}>
											<Button type='submit' variant='contained' size='large' fullWidth>
												Hoàn Tất
											</Button>
										</Grid>
										<Grid item xs={12}>
											<TextField
												fullWidth
												value={orderRequest.controls.orderCode.value}
												size='small'
												type='text'
												label='Mã đơn'
												placeholder='VD: 2024xxxxxx'
												helperText='Nếu để trống, mã đơn sẽ tự động sinh ra với định dạng: Năm + Thứ tự tăng dần'
												sx={{
													fontSize: '0.4rem !important'
												}}
												onChange={event => {
													handleOrderCodeChange(event)
												}}
											/>
										</Grid>
										<Grid item xs={12}>
											{usersSelection && usersSelection.length > 0 && (
												<Autocomplete
													fullWidth
													size='small'
													id='combo-box-demo'
													value={usersSelection.find(
														x => x.id === orderRequest.controls.PICStaffId.value
													)}
													options={usersSelection || []}
													renderInput={params => (
														<FormControl
															error={!orderRequest.controls.PICStaffId.result.isValid}
															variant='standard'
															fullWidth>
															<TextField
																{...params}
																error={!orderRequest.controls.PICStaffId.result.isValid}
																label='Người phụ trách'
															/>
															<FormHelperText>
																{orderRequest.controls.PICStaffId.result.errorMessage}
															</FormHelperText>
														</FormControl>
													)}
													onChange={(event, newValue, reason) => {
														if (
															event.type === 'keydown' &&
															((event as React.KeyboardEvent).key === 'Backspace' ||
																(event as React.KeyboardEvent).key === 'Delete') &&
															reason === 'removeOption'
														) {
															return
														}
														handlePicUserSelected(newValue)
													}}
													filterOptions={filterUserOptions}
													getOptionLabel={option => option.fullName}
													renderOption={(props, option) => (
														<li {...props}>
															<Badge
																overlap='circular'
																badgeContent={<BadgeContentSpan />}
																anchorOrigin={{
																	vertical: 'bottom',
																	horizontal: 'right'
																}}>
																<Avatar
																	alt='John Doe'
																	src='/images/avatars/1.png'
																	sx={{ width: '2.5rem', height: '2.5rem' }}
																/>
															</Badge>
															<Box
																sx={{
																	display: 'flex',
																	marginLeft: 3,
																	alignItems: 'flex-start',
																	flexDirection: 'column'
																}}>
																<Typography sx={{ fontWeight: 600 }}>
																	{option.fullName}
																</Typography>
															</Box>
														</li>
													)}
												/>
											)}
										</Grid>

										<Grid item xs={12}>
											<DatePickerWrapper>
												<DatePicker
													selected={orderRequest.controls.deliveryDate.value}
													showTimeInput
													timeFormat='HH:MM'
													showYearDropdown
													showMonthDropdown
													placeholderText='DD-MM-YYYY hh:mm:aa'
													customInput={<CustomInputs />}
													dateFormat='dd-MM-yyyy hh:mm:aa'
													onChange={(date: Date) => handleDeliveryDateChange(date)}
												/>
											</DatePickerWrapper>
										</Grid>
										<Grid item xs={12}>
											{usersSelection && usersSelection.length > 0 && (
												<Autocomplete
													fullWidth
													size='small'
													id='ConstructionStaff'
													value={usersSelection.find(
														x => x.id === orderRequest.controls.constructionStaffId.value
													)}
													options={usersSelection}
													renderInput={params => (
														<FormControl
															error={
																!orderRequest.controls.constructionStaffId.result
																	.isValid
															}
															variant='standard'
															fullWidth>
															<TextField
																{...params}
																error={
																	!orderRequest.controls.constructionStaffId.result
																		.isValid
																}
																label='Người thi công'
															/>
															<FormHelperText>
																{
																	orderRequest.controls.constructionStaffId.result
																		.errorMessage
																}
															</FormHelperText>
														</FormControl>
													)}
													onChange={(event, newValue, reason) => {
														if (
															event.type === 'keydown' &&
															((event as React.KeyboardEvent).key === 'Backspace' ||
																(event as React.KeyboardEvent).key === 'Delete') &&
															reason === 'removeOption'
														) {
															return
														}
														handleOnChangeSelectConstructionStaff(newValue)
													}}
													onReset={() => {
														handleOnChangeSelectConstructionStaff(null)
													}}
													filterOptions={filterUserOptions}
													getOptionLabel={option => option.fullName}
													renderOption={(props, option) => (
														<li {...props}>
															<Badge
																overlap='circular'
																badgeContent={<BadgeContentSpan />}
																anchorOrigin={{
																	vertical: 'bottom',
																	horizontal: 'right'
																}}>
																<Avatar
																	alt='John Doe'
																	src='/images/avatars/1.png'
																	sx={{ width: '2.5rem', height: '2.5rem' }}
																/>
															</Badge>
															<Box
																sx={{
																	display: 'flex',
																	marginLeft: 3,
																	alignItems: 'flex-start',
																	flexDirection: 'column'
																}}>
																<Typography sx={{ fontWeight: 600 }}>
																	{option.fullName}
																</Typography>
															</Box>
														</li>
													)}
												/>
											)}
										</Grid>
										<Grid item xs={12}>
											<Autocomplete
												fullWidth
												size='small'
												id='orderType'
												value={
													orderTypesSelection?.find(
														x => x.id == orderRequest.controls.orderType.value
													) || undefined
												}
												options={orderTypesSelection || []}
												renderInput={params => <TextField {...params} label='Loại đơn hàng' />}
												noOptionsText='Chưa có dữ liệu'
												onChange={(event, newValue, reason) => {
													handleOnChangeOrderType(newValue)
												}}
												getOptionLabel={option => option.name}
												renderOption={(props, option) => (
													<li {...props}>
														<Box
															sx={{
																display: 'flex',
																alignItems: 'flex-start',
																flexDirection: 'column'
															}}>
															<Typography>{option.name}</Typography>
														</Box>
													</li>
												)}
											/>
											<Typography variant='body2'>
												Bạn có thể thêm mới loại sản phẩm tại{' '}
												<Link onClick={() => {}} sx={{ cursor: 'pointer' }}>
													đây
												</Link>
											</Typography>
										</Grid>
									</Grid>
								</form>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			)}
			<Grid container>
				<Grid item xs={12}>
					{productsSelection && (
						<Card>
							<CardHeader title='Thông tin sản phẩm' titleTypographyProps={{ variant: 'h6' }} />
							<CardContent sx={{ paddingX: 0 }}>
								<Grid container px={5}>
									<Grid item xs={8}>
										{productsSelection && productsSelection.length > 0 && (
											<Autocomplete
												id='productSelectList'
												disableClearable
												inputValue={productInputText}
												options={productsSelection || []}
												renderInput={params => (
													<TextField
														{...params}
														value={productInputText}
														placeholder='Tìm theo tên, Mã SKU'
														onChange={event => {
															if (event.target.value) {
																handleOnProductInputChange(event.target.value)
															}
														}}
														InputProps={{
															...params.InputProps,
															startAdornment: (
																<Magnify
																	color='action'
																	style={{ marginRight: '8px' }}
																/>
															)
														}}
													/>
												)}
												filterOptions={filterProductOption}
												getOptionLabel={option => option.title}
												renderOption={(props, option) => (
													<li
														{...props}
														onMouseDown={() => {
															handleOnChangeSelectProduct(option)
														}}>
														<Grid container justifyContent='center' alignItems='center'>
															<Grid item xs={1}>
																<img
																	src={
																		option.imgUrl
																			? option.imgUrl
																			: 'https://sapo.dktcdn.net/100/689/126/variants/dinh-am-tuong-1675674468493.jpg'
																	}
																	width={40}
																	height={40}
																/>
															</Grid>
															<Grid item xs={7}>
																<Typography sx={{ fontWeight: 600 }}>
																	{option.title}
																</Typography>
																<Typography
																	variant='body2'
																	sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
																	{option.sku}
																</Typography>
															</Grid>
															<Grid item xs={4} textAlign='right'>
																<Typography sx={{ fontWeight: 600 }} color='success'>
																	{currencyVNDFormatter(option.price)}
																</Typography>
																<Typography color='secondary'>
																	Tồn kho: {option.stockQuantity}
																</Typography>
															</Grid>
														</Grid>
													</li>
												)}
											/>
										)}
									</Grid>
									<Grid item xs={2}></Grid>
									<Grid item xs={2}></Grid>
								</Grid>
								<Divider sx={{ mt: 5, mb: 0 }} />
								<OrderDetailsBox setNewOrderId={setNewOrderId} />
								<Divider sx={{ mt: 5, mb: 0 }} />
								<Grid container p={4} spacing={5}>
									<Grid item xs={8}>
										{orderRequest.isComplain && (
											<Grid container spacing={5} mb={5}>
												<Grid item xs={6}>
													<TextField
														fullWidth
														multiline
														rows={4}
														size='small'
														type='text'
														label='Vấn đề'
														placeholder='Vấn đề'
														helperText='Ghi chú vấn đề gặp phải'
														sx={{
															fontSize: '0.4rem !important'
														}}
														onChange={event => {
															handleProblemChange(event, 'problem')
														}}
													/>
												</Grid>
												<Grid item xs={6}>
													<TextField
														fullWidth
														multiline
														rows={4}
														size='small'
														type='text'
														label='Nguyên nhân'
														placeholder='Nguyên nhân'
														helperText='Ghi chú nguyên nhân'
														sx={{
															fontSize: '0.4rem !important'
														}}
														onChange={event => {
															handleProblemChange(event, 'rootCause')
														}}
													/>
												</Grid>
												<Grid item xs={6}>
													<TextField
														fullWidth
														multiline
														rows={4}
														size='small'
														type='text'
														label='Cách giải quyết'
														placeholder='Cách giải quyết'
														helperText='Ghi chú cách giải quyết'
														sx={{
															fontSize: '0.4rem !important'
														}}
														onChange={event => {
															handleProblemChange(event, 'solution')
														}}
													/>
												</Grid>
											</Grid>
										)}
										<Grid container spacing={5}>
											<Grid item xs={6}>
												<TextField
													rows={6}
													fullWidth
													multiline
													size='small'
													type='text'
													label='Ghi chú đơn hàng'
													placeholder='Ghi chú đơn hàng'
													helperText='Ghi chú cho tổng đơn hàng. Bạn cũng có thể ghi chú cho từng đơn hàng ở mỗi sản phẩm phía trên'
													sx={{
														fontSize: '0.4rem !important'
													}}
												/>
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={4}>
										<TotalBoxDetail />
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					)}
				</Grid>
			</Grid>
		</>
	)
}

const mapStateToProps = (state: IRootState) => ({
	state: state.orderAdmin
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	getDataProductCreate: (id?: string) => dispatch(getDataProductCreate(id)),
	handleChangeCustomer: () => dispatch(handleChangeCustomer()),
	handleSelectCustomer: (customer: IUserSelection, newState: IOrderRequest) =>
		dispatch(handleSelectCustomer(customer, newState)),
	handleUpdateStateProductSelected: (newState: IOrderProductDataItem[], newOrderRequestState: IOrderRequest) =>
		dispatch(handleUpdateStateProductSelected(newState, newOrderRequestState)),
	handleOnProductInputChange: (value: string) => dispatch(handleOnProductInputChange(value)),
	handleUpdateOrderRequest: (newState: IOrderRequest) => dispatch(handleUpdateOrderRequest(newState)),
	handleSelectPicUser: (newValue: IUserSelection | null, newState: IOrderRequest) =>
		dispatch(handleSelectPicUser(newValue, newState)),
	handleSelectConstructionUser: (newValue: IUserSelection | null, newState: IOrderRequest) =>
		dispatch(handleSelectConstructionUser(newValue, newState)),
	createOrder: (data: IOrderRequestBody) => dispatch(createOrder(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderAdminPage)

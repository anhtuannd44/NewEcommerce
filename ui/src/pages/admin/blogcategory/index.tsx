// ** MUI Imports
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'

// ** Demo Components Imports
import TableSelection, { ITableProps, TableColumn } from 'src/views/tables/TableSelection'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

import * as actions from 'src/redux/client/actions/productAction'
import { productApiRequest } from 'src/api/product'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types'
import FormLayoutsIcons from 'src/views/form-layouts/FormLayoutsIcons'
import { Button, CardContent, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import { AccountOutline, EmailOutline, MessageOutline, Phone } from 'mdi-material-ui'

const ProductAdminPage = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  interface DataItem {
    id: number
    title: string
    seoUrl: string
    shortDescription: string
  }

  const tableData: DataItem[] = []
  const prefix: string = ''

  const mappingData = (list: any, prefix: string) => {
    list.forEach((item: any) => {
      tableData.push({
        id: item.id,
        title: `${prefix}${item.title}`,
        seoUrl: item.seoUrl,
        shortDescription: item.shortDescription
      })

      if (Object.keys(item.children).length > 0) {
        prefix += '-- '
        mappingData(item.children, prefix)
      }
    })
  }

  mappingData(data, prefix)

  const columns: TableColumn<DataItem>[] = [
    { name: 'ids', field: 'id', align: 'left', width: '', ellipsis: false },
    { name: 'Tên', field: 'title', align: 'left', width: '30%', ellipsis: false },
    { name: 'Đường dẫn', field: 'seoUrl', align: 'left', width: '30%', ellipsis: false },
    { name: 'Mô tả', field: 'shortDescription', align: 'left', width: '', ellipsis: true }
  ]

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={8}>
          <Card>
            <CardHeader title='Tất cả danh mục' titleTypographyProps={{ variant: 'h6' }} />
            <TableSelection<DataItem> data={tableData} columns={columns} />
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader title='Thêm mới danh mục' titleTypographyProps={{ variant: 'h6' }} />
            <CardContent>
              <form onSubmit={e => e.preventDefault()}>
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField size='small' fullWidth type='text' label='Tên danh mục' placeholder='Nhập danh mục của bạn' helperText='Đây là tên hiển thị ở trang tập hợp danh mục bài viết' />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type='text'
                      label='Meta Title'
                      placeholder='Nhập tên danh mục meta title của bạn'
                      helperText='Đây là tên sẽ hiển thị trên công cụ tìm kiếm và cái social network'
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type='text'
                      label='Đường dẫn tĩnh'
                      placeholder='danh-muc-cua-ban'
                      helperText='Đường dẫn thân thiện của tên. Nó thường chỉ bao gồm kí tự viết thường, số và dấu gạch ngang, không dùng tiếng Việt'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id='demo-simple-select-standard-label'>Danh mục cha</InputLabel>
                      <Select fullWidth labelId='demo-simple-select-standard-label' id='demo-simple-select-standard' label='Danh mục cha'>
                        <MenuItem value=''>
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={10}>Ten</MenuItem>
                        <MenuItem value={20}>Twenty</MenuItem>
                        <MenuItem value={30}>Thirty</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={5}
                      sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                      type='text'
                      label='Mô tả'
                      placeholder='Nhập mô tả'
                      helperText='Thông thường mô tả này không được sử dụng trong các giao diện, tuy nhiên có vài giao diện có thể hiển thị mô tả này.'
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={5}
                      sx={{ '& .MuiOutlinedInput-root': { alignItems: 'baseline' } }}
                      type='text'
                      label='Meta Description'
                      placeholder='Nhập mô tả meta description'
                      helperText='Đây là mục hiển thị mô tả ngắn ở các công cụ tìm kiếm.'
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button type='submit' variant='contained' size='large'>
                      Hoàn Tất
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export const getServerSideProps = async () => {
  const a = await productApiRequest.getList()
  return { props: { data: a.data } }
}

export default ProductAdminPage

import { Grid, Skeleton, Stack } from '@mui/material'

const CreateOrEditLoadingBox = () => {
  return (
    <>
      <Grid container spacing={6} mb={5}>
        <Grid item xs={9}>
          <Stack spacing={1}>
            <Skeleton variant='rounded' height={60} />
            <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
            <Skeleton variant='rounded' height={250} />
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack spacing={1}>
            <Skeleton variant='rounded' height={60} />
            <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
            <Skeleton variant='rounded' height={250} />
          </Stack>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Skeleton variant='rounded' height={60} />
            <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
            <Skeleton variant='rounded' height={400} />
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}
export default CreateOrEditLoadingBox

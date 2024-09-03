import { Grid2 as Grid, Skeleton, Stack } from '@mui/material'

const CreateOrEditProductLoadingBox = () => {
  return (<>
    <Grid container spacing={6} mb={5}>
      <Grid size={9}>
        <Stack spacing={1}>
          <Skeleton variant='rounded' height={60} />
          <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
          <Skeleton variant='rounded' height={250} />
        </Stack>
      </Grid>
      <Grid size={3}>
        <Stack spacing={1}>
          <Skeleton variant='rounded' height={60} />
          <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
          <Skeleton variant='rounded' height={250} />
        </Stack>
      </Grid>
    </Grid>
    <Grid container>
      <Grid size={12}>
        <Stack spacing={1}>
          <Skeleton variant='rounded' height={60} />
          <Skeleton variant='text' sx={{ fontSize: '1rem' }} />
          <Skeleton variant='rounded' height={400} />
        </Stack>
      </Grid>
    </Grid>
  </>);
}

export default CreateOrEditProductLoadingBox

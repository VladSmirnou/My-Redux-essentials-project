import { useAppDispatch } from '@/common/hooks/useAppDispatch'
import { useAppSelector } from '@/common/hooks/useAppSelector'
import { selectAllUsers } from '@/features/users/model/usersSlice'
import { useForm } from 'react-hook-form'
import { Navigate } from 'react-router-dom'
import { loginUser, selectLoggedInUserId } from '../model/authSlice'

type FormFields = {
  username: string
}

const defaultValues = {
  username: '',
}

export const LoginPage = () => {
  const dispatch = useAppDispatch()
  const loggedInUserId = useAppSelector(selectLoggedInUserId)

  const userNames = useAppSelector(selectAllUsers)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues,
  })

  if (loggedInUserId) {
    return <Navigate to={'/'} />
  }

  const onSubmit = (data: FormFields) => {
    dispatch(loginUser(data.username))
  }

  const JSXUserOptions = userNames.map(({ id, name }) => {
    return (
      <option value={id} key={id}>
        {name}
      </option>
    )
  })

  return (
    <section>
      <h2>Welcome to Tweeter!</h2>
      <h3>Please log in:</h3>onSubmit
      <form onSubmit={handleSubmit(onSubmit)}>
        <select
          {...register('username', {
            required: { value: true, message: 'username is required' },
          })}
        >
          <option value="" key={'default'}></option>
          {JSXUserOptions}
        </select>
        {errors.username && <p>{errors.username.message}</p>}
        <button>submit</button>
      </form>
    </section>
  )
}

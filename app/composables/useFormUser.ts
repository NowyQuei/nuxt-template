import { z } from 'zod'
import { useDayjs } from '#dayjs'
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

export function useFormUser(
  schema: z.ZodSchema<any>,
  initialUser?: Partial<z.infer<typeof schema>>
) {
  const isLoggedIn = useUserSession().loggedIn
  const schemaWithoutId = schema.omit({ id: true }) // ✅ Omit `id` from validation
  const dayjs = useDayjs()
  const userLocale = computed(() => dayjs.locale())
  const df = computed(() => new DateFormatter(userLocale.value, { dateStyle: 'long' }))

  const defaultBirthday = dayjs().subtract(18, 'years')

  // ✅ Merge initial user data with defaults
  const state = reactive<
    Partial<z.infer<typeof schemaWithoutId>> & {
      createPasskey: boolean
      passkeyName: string
    }
  >({
    username: initialUser?.username || '',
    firstName: initialUser?.firstName || '',
    lastName: initialUser?.lastName || '',
    email: initialUser?.email || '',
    password: isLoggedIn.value ? '' : initialUser?.password || '', // ✅ Empty on settings page
    birthday: initialUser?.birthday ? new Date(initialUser.birthday) : defaultBirthday.toDate(),
    createPasskey: true,
    passkeyName: ''
  })

  const calendarDate = shallowRef(
    new CalendarDate(
      dayjs(state.birthday).year(),
      dayjs(state.birthday).month() + 1,
      dayjs(state.birthday).date()
    )
  )

  watch(calendarDate, (newDate) => {
    state.birthday = newDate.toDate(getLocalTimeZone())
  })

  return { state, calendarDate, df }
}

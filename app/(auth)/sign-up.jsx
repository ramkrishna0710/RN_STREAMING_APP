import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import FromField from '../../components/FromField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'

const SignUP = () => {

  const [form, setForm] = useState({
      username: '',
      email: '',
      password: '',
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = async () => {
      if(!form.username || !form.email || !form.password) {
        Alert.alert('Error', 'Plaease fill in all the fields')
      }
      setIsSubmitting(true);
      try {
        const result = await createUser(form.email, form.password, form.username)

        //set it global state...

        router.replace('/home')
      } catch (error) {
        Alert.alert('Error', error.message)
      } finally {
        setIsSubmitting(false)
      }
    }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center h-full px-4 my-6">
          <Image
            source={images.logo}
            className="w-[115px] h-[35px]"
            resizeMode='contain'
          />
          <Text className="text-xl text-white text-semibold mt-10 font-psemibold">Sign up to Ram</Text>

          <FromField
            title="User Name"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e})}
            otherStyles="mt-10"
          />

          <FromField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FromField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e})}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100">Have an account already?</Text>
            <Link href="/sign-in" className='text-sm font-psemibold text-secondary'>Sign In</Link>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUP
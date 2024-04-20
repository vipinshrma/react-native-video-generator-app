import { ResizeMode, Video } from 'expo-av'
import React, { useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { icons } from '../../constants'
import { getDocumentAsync } from 'expo-document-picker'
import { router } from 'expo-router'
import {  createVideoPost } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import * as ImagePicker from 'expo-image-picker';

export default function Create() {
  const [form, setForm] = useState({
    title: '',
    video: '',
    thumbnail: "",
    prompt: ''
  })
  const { user } = useGlobalContext()
  const [isUploading, setUploading] = useState(false)

  const openPicker = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === "image" ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          thumbnail: result.assets[0],
        })
      }

      if (selectType === "video") {
        setForm({
          ...form,
          video: result.assets[0],
        })
      }
    }
    // else {
    //   setTimeout(() => {
    //     Alert.alert("Document picked", JSON.stringify(result, null, 2));
    //   }, 100);
    // }
  };
  console.log(form)

  const onSubmit = async () => {

    if (!form.title || !form.prompt || !form.thumbnail || !form.video) {
      return Alert.alert('Please fill all the fields')
    }
    setUploading(true)

    try {
      await createVideoPost({ ...form, userId: user?.$id })
      Alert.alert('Success', "Post Uploaded successfully")
      router.push('/home')
    } catch (error) {
      Alert.alert('Error', error.message)
    } finally {
      // setForm({
      //   title: '',
      //   video: '',
      //   thumbnail: "",
      //   prompt: ''
      // })
    }

  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView className='px-4 my-6'>
        <Text
          className='text-2xl text-white font-psemibold'
        >
          Upload Video
        </Text>

        <FormField
          value={form.title}
          placeholder='Give your video a catch title..'
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles='mt-10'
        />

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker('video')}>
            {
              form?.video ?
                <Video
                  source={form.video}
                  shouldPlay
                  resizeMode={ResizeMode.COVER}
                  className='w-full h-64 rounded-2xl'
                /> : (
                  <View className='w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center'>
                    <View className='w-14 h-14 border border-dashed border-secondary-100 justify-center items-center'>
                      <Image
                        source={icons.upload}
                        resizeMethod='contain'
                        className='w-1/2 h-1/2'
                      />

                    </View>
                  </View>
                )
            }
          </TouchableOpacity>
        </View>

        <View className='mt-7 space-y-2'>
          <Text className='text-base text-gray-100 font-pmedium'>
            Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker('image')}>
            {
              form?.thumbnail ?
                <Image
                  source={{ uri: form.thumbnail.uri }}
                  className='w-full h-64 rounded-2xl'
                  resizeMode='cover'
                /> : (
                  <View className='w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-black-200 border-2 flex-row space-x-2'>
                    <Image
                      source={icons.upload}
                      resizeMode='contain'
                      className='w-5 h-5'
                    />
                    <Text className='text-sm text-gray-100 font-pmedium'>Choose a file</Text>

                  </View>
                )
            }
          </TouchableOpacity>
        </View>

        <FormField
          value={form.prompt}
          placeholder='The prompt you used to create this video'
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles='mt-7'
        />


        <CustomButton
          title='Submit & Publish'
          handlePress={onSubmit}
          containerStyles="mt-7"
          isLoading={isUploading}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

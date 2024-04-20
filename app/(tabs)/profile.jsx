import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, RefreshControl, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import EmptyState from '../../components/EmptyState'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import VideoCard from '../../components/VideoCard'
import { icons, images } from '../../constants'
import useAppWrite from '../../hooks/useAppWrite'
import { getAllLatestPost, getAllPost, searchPost, signout } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getUserPost } from '../../lib/appwrite'
import InfoBox from '../../components/InfoBox'

export default function Profile() {
  const { query } = useLocalSearchParams()
  const { user,setUser,setIsLoggedIn } = useGlobalContext()
  const [refreshing, setRefreshing] = useState(false)
  const { isLoading, refetch, data = [] } = useAppWrite(() => getUserPost(user?.$id))

  const logout = async() => {
    await signout()
    setIsLoggedIn(false)
    setUser({})

    router.replace('/sign-in')
  }
  return (
    <SafeAreaView className='bg-primary h-full'>
      <FlatList
        data={data}
        keyExtractor={(({ $id }) => $id)}
        renderItem={(({ item }) => {
          return <VideoCard video={item} />
        })}
        ListHeaderComponent={() => {
          return (
            <View className='w-full justify-center items-center mt-6 mb-12 px-4'>
              <TouchableOpacity className='w-full items-end mb-10'
                onPressOut={logout}
              >
                <Image
                  source={icons.logout}
                  resizeMode='contain'
                  className='w-6 h-6'
                />
              </TouchableOpacity>

              <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
                <Image
                  source={{ uri: user?.avatar }}
                  className='w-[90%] h-[90%] rounded-lg'
                  resizeMode='cover'
                />
              </View>
              <InfoBox
                title={user?.username}
                containerStyles='mt-5'
                titleStyles='text-lg'
              />

              <View
                className='mt-5 flex-row'
              >
                <InfoBox
                  title={data?.length || 0}
                  subtitle="Posts"
                  containerStyles='mr-10'
                  titleStyles='text-xl'
                />

                <InfoBox
                  title="1.2k"
                  titleStyles='text-xl'
                  subtitle="followers"
                />


              </View>

            </View>
          )
        }}
        ListEmptyComponent={() => {
          return <EmptyState
            title='No Videos found'
            subtitle='No Videos found for this search query'
          />

        }}
      />
    </SafeAreaView>
  )
}


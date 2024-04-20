import React, { useEffect, useState } from 'react'
import { Alert, FlatList, Image, RefreshControl, SafeAreaView, Text, View } from 'react-native'
import EmptyState from '../../components/EmptyState'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import VideoCard from '../../components/VideoCard'
import { images } from '../../constants'
import { useGlobalContext } from '../../context/GlobalProvider'
import useAppWrite from '../../hooks/useAppWrite'
import { getAllLatestPost, getAllPost } from '../../lib/appwrite'
export default function Home() {
  const [refreshing, setRefreshing] = useState(false)
  const { isLoading, refetch, data } = useAppWrite(getAllPost)
  const { data: latestPost } = useAppWrite(getAllLatestPost)
  const { user } = useGlobalContext()


  const onRefresh = async () => {
    refetch()
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
            <View className='my-6 px-4 space-y-6'>
              <View className='justify-between items-start flex-row mb-6'>
                <View >
                  <Text className='font-pmedium text-sm text-gray-100'>Welcome Back</Text>
                  <Text className='text-2xl font-psemibold text-white'>{user?.username}</Text>
                </View>
                <View className='mt-1.5'>
                  <Image
                    source={images.logoSmall}
                    className='w-9 h-10'
                    resizeMode='contain'
                  />
                </View>
              </View>
              <SearchInput
                placeholder={'Search for a video topic'}
              />
              <View className='w-full flex-1 pt-5 pb-8'>
                <Text className='text-gray-100 text-lg font-pregular mb-3'>
                  Latest Videos
                </Text>
                <Trending
                  posts={
                    latestPost ?? []
                  }
                />
              </View>
            </View>
          )
        }}
        ListEmptyComponent={() => {
          return <EmptyState
            title='No Videos found'
            subtitle='Be the first one to upload a video'
          />

        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

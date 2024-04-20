import React, { useState } from 'react'
import { FlatList, Image, ImageBackground, Text, TouchableOpacity } from 'react-native'
import EmptyState from './EmptyState'
import { icons } from '../constants'
import { View } from 'react-native-animatable'
import { ResizeMode, Video } from 'expo-av'

const zoomIn = {
  0: {
    scale: 0.9
  },
  1: {
    scale: 1.1
  }
}

const zoomOut = {
  0: {
    scale: 1.1
  },
  1: {
    scale: 0.9
  }
}


const TrendingItem = ({ item, activeItem }) => {
  const [play, setPlay] = useState(false)

  const viewAbleItemChanges = () => {

  }

  return (
    <View
      className='mr-5'
      animation={activeItem === item?.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {
        play ? (
          <Video
            source={{ uri: item.video }}
            className='w-52 h-72 rounded-[35px] mt-3 bg-white/10'
            useNativeControls
            shouldPlay
            resizeMode={ResizeMode.CONTAIN}
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setPlay(false)
              }

            }}
          />
        ) : <>
          <TouchableOpacity
            className='relative justify-center items-center'
            activeOpacity={0.7}
            onPress={() => setPlay(true)}
          >
            <ImageBackground
              source={{ uri: item.thumbnail }}
              className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
              resizeMode='cover'
            />
            <Image
              source={icons.play}
              className='w-12 h-12 absolute'
              resizeMode='contain'
            />
          </TouchableOpacity>
        </>
      }
    </View>
  )
}

function Trending({ posts }) {
  const [activeItem, setActiveItem] = useState(posts[0])
  const onViewableItemsChanged = ({ viewableItems }) => {
    console.log("viewableItems", viewableItems)
    if (viewableItems?.length > 0) {
      setActiveItem(viewableItems[0].key)
    }
  }
  console.log("active item", activeItem)
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={(({ item }) => {
        return <TrendingItem activeItem={activeItem} item={item} />
      })}
      onViewableItemsChanged={onViewableItemsChanged}
      horizontal
      ListEmptyComponent={() => {
        return <EmptyState
          title='No Videos found'
          subtitle='Be the first one to upload a video'
        />
      }}
      viewabilityConfig={
        {
          itemVisiblePercentThreshold: 70
        }
      }
      contentOffset={{ x: 170 }}
    />
  )
}

export default Trending
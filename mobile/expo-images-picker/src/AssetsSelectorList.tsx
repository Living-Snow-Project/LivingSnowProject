import React, { memo } from 'react'
import { FlatList } from 'react-native'
import { Asset } from 'expo-media-library'
import styled from 'styled-components/native'
import { IComponentItem, IComponentItems } from './AssetsSelectorTypes'

const Item = ({
    id,
    screen,
    cols,
    selectedIndex,
    image,
    mediaType,
    onClick,
    margin,
    selectedIcon,
    videoIcon,
}: IComponentItem) => {
    const handleClick = () => {
        onClick(id)
    }

    const { Component, color, iconName, size, bg } = selectedIcon

    const {
        Component: VideoIndicator,
        color: VideoIndicatorColor,
        iconName: VideoIndicatorName,
        size: VideoIndicatorSize,
    } = videoIcon

    return (
        <Block
            margin={margin}
            screen={screen}
            cols={cols}
            onPress={handleClick}
        >
            {mediaType === 'video' && (
                <MediaTypeVideo margin={margin}>
                    {VideoIndicator && VideoIndicatorName && (
                        <VideoIndicator
                            name={VideoIndicatorName}
                            size={VideoIndicatorSize}
                            color={VideoIndicatorColor}
                        />
                    )}
                </MediaTypeVideo>
            )}
            {selectedIndex >= 0 && (
                <Selected selectionColor={bg} margin={margin}>
                    {Component && (
                        <Component
                            name={iconName}
                            size={size}
                            color={color}
                            index={selectedIndex}
                        />
                    )}
                </Selected>
            )}
            <Image source={{ uri: image }} />
        </Block>
    )
}

const MemoizedAssetItem = memo(Item)

export const AssetsSelectorList = ({
    margin,
    data,
    selectedItems,
    onClick,
    getMoreAssets,
    cols,
    screen,
    selectedIcon,
    videoIcon,
    noAssets,
}: IComponentItems) => {
    const _renderItem = ({ item }: { item: Asset }) => (
        <MemoizedAssetItem
            id={item.id}
            image={item.uri}
            mediaType={item.mediaType}
            selectedIndex={selectedItems.indexOf(item.id)}
            onClick={onClick}
            cols={cols}
            screen={screen}
            margin={margin}
            selectedIcon={selectedIcon}
            videoIcon={videoIcon}
        />
    )

    const _getItemLayout = (
        data: Asset[] | null | undefined,
        index: number
    ) => {
        let length = screen / cols
        return { length, offset: length * index, index }
    }

    return (
        <FlatList
            data={data}
            numColumns={cols}
            initialNumToRender={50}
            getItemLayout={_getItemLayout}
            renderItem={_renderItem}
            keyExtractor={(item) => item.id}
            extraData={selectedItems}
            onEndReached={() => getMoreAssets()}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={noAssets}
        />
    )
}

const Image = styled.Image`
    width: 100%;
    height: 100%;
`

const MediaTypeVideo = styled.View<{ margin: number }>`
    width: 25%;
    justify-content: center;
    align-items: center;
    height: 25%;
    position: absolute;
    z-index: 11;
    margin: ${({ margin }) => margin}px;
`
const Selected = styled.View<{ margin: number; selectionColor: string }>`
    position: absolute;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    z-index: 10;
    background-color: ${({ selectionColor }) =>
        selectionColor ? selectionColor : '#8bc34a70'};
    margin: ${({ margin }) => margin}px;
`

const Block = styled.TouchableOpacity<{
    margin: number
    screen: number
    cols: number
}>`
    width: ${({ screen, cols }) => screen / cols}px;
    height: ${({ screen, cols }) => screen / cols}px;
    padding: ${({ margin }) => margin}px;
`

import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils'
import { screen } from '@testing-library/react'
import { BodyShape, ChainId, Network, NFTCategory, Rarity, WearableCategory } from '@dcl/schemas'
import { Asset } from '../../modules/asset/types'
import { INITIAL_STATE } from '../../modules/favorites/reducer'
import { SortBy } from '../../modules/routing/types'
import { renderWithProviders } from '../../utils/test'
import AssetCard from './AssetCard'
import { Props as AssetCardProps } from './AssetCard.types'

const FAVORITES_COUNTER_TEST_ID = 'favorites-counter'

function renderAssetCard(props: Partial<AssetCardProps> = {}) {
  return renderWithProviders(
    <AssetCard
      asset={{} as Asset}
      price={null}
      isClaimingBackLandTransactionPending={false}
      showRentalChip={false}
      rental={null}
      sortBy={SortBy.RECENTLY_LISTED}
      appliedFilters={{ maxPrice: '100', minPrice: '1' }}
      {...props}
    />,
    {
      preloadedState: {
        favorites: {
          ...INITIAL_STATE,
          data: {
            items: {
              '0xContractAddress-itemId': { pickedByUser: false, count: 35 }
            },
            lists: {}
          }
        }
      }
    }
  )
}

describe('AssetCard', () => {
  let asset: Asset

  beforeEach(() => {
    asset = {
      id: '0xContractAddress-itemId',
      name: 'assetName',
      urn: '',
      thumbnail: 'assetThumbnail',
      url: 'assetUrl',
      category: NFTCategory.WEARABLE,
      contractAddress: '0xContractAddress',
      itemId: '',
      rarity: Rarity.UNIQUE,
      price: '5000000000000000',
      available: 0,
      isOnSale: false,
      creator: '0xCreator',
      beneficiary: null,
      createdAt: 0,
      updatedAt: 0,
      reviewedAt: 0,
      soldAt: 0,
      data: {
        wearable: {
          rarity: Rarity.UNIQUE,
          category: WearableCategory.BODY_SHAPE,
          bodyShapes: [BodyShape.MALE]
        } as Asset['data']['wearable']
      },
      network: Network.MATIC,
      chainId: ChainId.MATIC_AMOY,
      firstListedAt: null
    }
  })

  it('should render the Asset Card', () => {
    renderAssetCard({ asset })
  })

  describe('when its interesected', () => {
    it('should render the Asset Card content', () => {
      renderAssetCard({
        asset
      })
      mockAllIsIntersecting(true)
      expect(screen.getByTestId('asset-card-content')).toBeInTheDocument()
    })
  })

  describe('when its not interesected', () => {
    it('should not render the Asset Card content', () => {
      renderAssetCard({
        asset
      })
      expect(screen.queryByTestId('asset-card-content')).not.toBeInTheDocument()
    })
  })

  describe('when the asset is an item', () => {
    beforeEach(() => {
      asset = { ...asset, itemId: 'itemId' } as Asset
    })

    it('should render the favorites counter', () => {
      renderAssetCard({
        asset
      })
      mockAllIsIntersecting(true)
      expect(screen.getByTestId(FAVORITES_COUNTER_TEST_ID)).toBeInTheDocument()
    })
  })

  describe('when the asset is an nft', () => {
    beforeEach(() => {
      asset = { ...asset, tokenId: 'tokenId' } as Asset
    })

    it('should not render the favorites counter', () => {
      const { queryByTestId } = renderAssetCard({
        asset
      })
      expect(queryByTestId(FAVORITES_COUNTER_TEST_ID)).toBeNull()
    })
  })
})

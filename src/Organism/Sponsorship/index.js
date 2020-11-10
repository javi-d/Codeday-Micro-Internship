import React, { forwardRef } from 'react';
import useSwr from 'swr';
import List, { Item } from 'topo/Atom/List';
import Box from 'topo/Atom/Box';
import Divider from 'topo/Atom/Divider';
import { Flex, Icon } from "@chakra-ui/core"
import Skelly from 'topo/Atom/Skelly';
import Text, { Heading, Link, CopyText } from 'topo/Atom/Text';
import Content from 'topo/Molecule/Content';
import { childrenOfType, makePureBox } from 'topo/_utils';
import { useString, apiFetch } from 'topo/utils';

// GraphQL Query, pulls data from the sponsorship programs area
const query = `{
  cms {
    programs {
      items {
        sponsorPerks
      }
    }
  }
}`;

const SponsorTable = () => {

  // Pull data from GraphQL Query from above
  const { data, error } = useSwr(
    query,
    apiFetch,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Let pulled data from GraphQL be set equal to the levels variable
  const { levels } = data?.cms?.programs?.items[0]?.sponsorPerks || {};
  
  // DEBUG: Print straight to console to ensure data is being queried correctly
  // console.log(levels);

  // Return HTML
  return (
    <Box>
      <Heading as="h1">Virtual CodeDay Sponsorships</Heading>
      <Heading as="h4">{(new Date()).getFullYear()}-{(new Date()).getFullYear()+1} School Year</Heading>

      <List marginTop={4}>
        <Flex size="100%" justify="left" alignItems="left" flexDirection="row" flexWrap="wrap">
          {!(levels) ? (
            <>
              <Item><Skelly /></Item>
              <Item><Skelly /></Item>
              <Item><Skelly /></Item>
            </>
          ) : Object.keys(levels).map((key, index) => <SponsorBox key={levels[key].name} level={levels[key]}></SponsorBox> )}
        </Flex>
      </List>
      <Text as="i" marginTop={5}>&sup1; Available on first-come basis.<br/>&sup2; We'll handle fulfillment. Large swag items are only sent to the first 2,000 registrants.</Text>

    </Box>
  );
};

/*
 * method SponsorBox
 * description: takes an individual level and creates a box for that level
 * params: @level is any given sponsor/level of sponsorship
*/
function SponsorBox({ level }) {
  return (
  <Box marginRight={3} w="275px">
        <Box borderWidth="2px" p={3} w="100%" borderColor={level.boxColor} roundedTopLeft="lg" roundedTopRight="lg" color={level.titleColor} backgroundColor={level.boxColor}>
          {level.name}
        </Box>
        <Box borderWidth="2px" borderColor={level.borderColor} roundedBottomLeft="lg" roundedBottomRight="lg">
          <Box backgroundColor={level.boxTint} p={3} w="100%">
            <strong>${level.amount}/{level.amountInterval}</strong><br></br>
            {level.description}
          </Box>
        </Box>
    
    <PerksGroups items={level.perks} isFirst={level.isFirst}></PerksGroups>
  </Box>
  );
}

/*
 * method PerksGroups
 * description: takes an array of perks from a given level and outputs their respective perks
 * params: 
 * @items is the actual list of perks to be rendered. is passed later on to PerksList
 * @isFirst simple boolean to check if item is the first in list
*/
function PerksGroups({ items, isFirst }) {
  return Object.keys(items).map((key, index) => 
    <Box key={items[key].name} marginTop={5}>
      {isFirst ? (<Text h="12px" fontWeight={1000}>{items[key].name}</Text>)
      : (<Text h="12px"></Text>)}
        
      <Box marginBottom={2} h="2px" w="90%" backgroundColor="#E7E7E5"></Box>
      <PerksList perks={items[key]}/>
    </Box>
  );
}


/*
 * method PerksList
 * description: takes an array of perks from a given level and outputs their respective perks
 * params: perks is a given levels perk list
*/
function PerksList({ perks }) {
  return (
    <List>
      {perks ? (perks.items.map((perk) => (
        <Flex key={perk.text} size="100%" justify="left" alignItems="left" flexDirection="row" flexWrap="nowrap">
          <Icon name="check" size="24px" marginRight="3" color="red.500" />
          <Text h="50px">{perk.text}</Text>
        </Flex>
      ))) : (
        <>
          <Item><Skelly/></Item>
          <Item><Skelly/></Item>
        </>
      )}
      {perks ? (perks.noItems.map((noPerk) => (
          <Flex key={noPerk.text} size="100%" justify="left" alignItems="left" flexDirection="row" flexWrap="nowrap">
            <Icon name="small-close" size="24px" marginRight="3" color="#A29899" />
            <Text h="50px">{noPerk.text}</Text>
          </Flex>
      ))) : (
        <>
        <Item><Skelly/></Item>
        <Item><Skelly/></Item>
      </>
      )}
      
    </List>
  );
}


// Actual Sponsorship Object that will be used in external pages
const Sponsorship = forwardRef(({ children }, ref) => {
  return (
    <Content ref={ref} role="contentinfo">
      <SponsorTable/>
    </Content>
  );
});

export default Sponsorship;

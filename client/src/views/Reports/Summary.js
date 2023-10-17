import React, { Component } from 'react';
import Box from '@material-ui/core/Box';

import LineChart from './LineChart'
import Interests from './Summary/Interests';
import FamilyFriendsNeighbours from './Summary/FamilyFriendsNeighbours';
import CommunityParticipation from './Summary/CommunityParticipation';

// import SocialHealth from './Summary/SocialHealth';

export default class Summary extends Component {
    render() {
        return (
            <>
                <Box m={1}>
                    <Interests reports={this.props.reports} collection={this.props.collection} />
                    <FamilyFriendsNeighbours reports={this.props.reports} collection={this.props.collection} />
                    {/* <CommunityParticipation reports = {this.props.reports} collection = {this.props.collection}/> 
                    {/* <SocialHealth reports = {this.props.reports} collection = {this.props.collection}/> */}
                </Box>
            </>
        )
    }
}
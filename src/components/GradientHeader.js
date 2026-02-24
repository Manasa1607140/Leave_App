import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from './ui/AppHeader';

const GradientHeader = (props) => <AppHeader {...props} />;

export default React.memo(GradientHeader);

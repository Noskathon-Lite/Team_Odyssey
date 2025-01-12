import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigationState, useFocusEffect } from '@react-navigation/native';

const BottomNav = ({ navigation }) => {
  const [selectedNavItem, setSelectedNavItem] = useState('HomeScreen'); // Set default to 'HomeScreen'

  const navItems = [
    { name: 'HomeScreen', icon: 'home' },
    { name: 'ReportScreen', icon: 'report' },
    { name: 'My Reports', icon: 'description' },
    { name: 'ProfileScreen', icon: 'person' },
  ];

  // Update selectedNavItem based on the current route
  useFocusEffect(
    React.useCallback(() => {
      const currentRoute = navigation.getState().routes[navigation.getState().index]?.name;
      setSelectedNavItem(currentRoute);
    }, [navigation])
  );

  const handleNavItemPress = (name) => {
    setSelectedNavItem(name);
    if(name === 'HomeScreen') {
      navigation.navigate('HomeScreen');
    } else if(name === 'ReportScreen') {
      navigation.navigate('MapScreen');
    }else if(name === 'My Reports') {
      navigation.navigate('My Reports');
    }else{
      navigation.navigate('ProfileScreen');
    }
  };

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          style={[
            styles.navItem,
            selectedNavItem === item.name && styles.selectedNavItem, // Apply selected item style
          ]}
          onPress={() => handleNavItemPress(item.name)}
        >
          <Icon
            name={item.icon}
            size={30}
            color={selectedNavItem === item.name ? '#4C9BF1' : '#A0A0A0'} // Color change based on selection
            style={styles.navIcon}
          />
          <Text
            style={[
              styles.navText,
              { color: selectedNavItem === item.name ? '#4C9BF1' : '#A0A0A0' }, // Color change based on selection
            ]}
          >
            {item.name.replace('Screen', '')} {/* Remove 'Screen' from the text display */}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderRadius: 15,
    height: 70,
    marginBottom: 0,
  },
  navItem: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  selectedNavItem: {
    backgroundColor: '#F1F1F1', // Background color for the selected item
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  navIcon: {
    marginBottom: 5,
  },
  navText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default BottomNav;
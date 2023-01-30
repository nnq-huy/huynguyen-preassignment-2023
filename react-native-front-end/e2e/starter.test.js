describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have bottom navigation bar visible, efault screen is Home screen, button to push new stations to database shout be disabled whne no csv file is uploaded', async () => {
    await expect(element(by.id('bottom-navigation-bar'))).toBeVisible();
    await expect(element(by.id('home-screen-appbar'))).toBeVisible();
    expect(element(by.id('push-stations-button'))).toHaveProperty("disabled");
  });

  /* it('should show hello screen after tap', async () => {
    await element(by.id('hello_button')).tap();
    await expect(element(by.text('Hello!!!'))).toBeVisible();
  });

  it('should show world screen after tap', async () => {
    await element(by.id('world_button')).tap();
    await expect(element(by.text('World!!!'))).toBeVisible();
  }); */
});

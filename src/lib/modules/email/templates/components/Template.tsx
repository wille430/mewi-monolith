import {
    Mjml,
    MjmlAttributes,
    MjmlBody,
    MjmlClass,
    MjmlColumn,
    MjmlHead,
    MjmlImage,
    MjmlNavbar,
    MjmlNavbarLink,
    MjmlSection,
    MjmlText,
} from 'mjml-react'
import { ReactNode } from 'react'

export const Template = ({ children }: { children: ReactNode }) => {
    return (
        <Mjml>
            <MjmlHead>
                <MjmlAttributes>
                    <MjmlText
                        font-family='Ubuntu, Helvetica, Arial, sans-serif'
                        padding='0 25px'
                        font-size='13px'
                    ></MjmlText>
                    <MjmlSection background-color='#253c4c'></MjmlSection>
                    <MjmlClass name='preheader' color='#000000' font-size='11px'></MjmlClass>
                </MjmlAttributes>
            </MjmlHead>
            <MjmlBody backgroundColor='#bedae6'>
                <MjmlSection>
                    <MjmlColumn width='100%' paddingTop='12px' paddingBottom='12px'>
                        <MjmlImage
                            height='auto'
                            width='150px'
                            src='/img/logo.png'
                            alt='header image'
                            padding='0px'
                        ></MjmlImage>
                    </MjmlColumn>
                </MjmlSection>
                {children}
                <MjmlSection backgroundColor='#253c4c' padding='20px'>
                    <MjmlColumn>
                        <MjmlNavbar baseUrl={process.env.CLIENT_URL}>
                            <MjmlNavbarLink href='/' color='white'>
                                Hem
                            </MjmlNavbarLink>
                            <MjmlNavbarLink href='/sok' color='white'>
                                Sök
                            </MjmlNavbarLink>
                            <MjmlNavbarLink href='/minasidor' color='white'>
                                Mina Sidor
                            </MjmlNavbarLink>
                        </MjmlNavbar>

                        {/* <MjmlText color='whitesmoke' lineHeight='18px' paddingBottom='20px'>
                            <span>
                                © 2021 Bungie, Inc. All rights reserved. Destiny, the Destiny Logo,
                                Bungie and the Bungie Logo are among the trademarks of Bungie, Inc.
                                ESRB rating icons are registered trademarks of the Entertainment
                                Software Association (ESA) and may not be used without permission of
                                the ESA. All other trademarks and trade names are the properties of
                                their respective owners.
                            </span>
                        </MjmlText>

                        <MjmlText color='whitesmoke' lineHeight='18px'>
                            <span>
                                Bungie, Inc. 550 106th Avenue NE, Suite 207 Bellevue, WA 98004
                            </span>
                        </MjmlText> */}
                    </MjmlColumn>
                </MjmlSection>
            </MjmlBody>
        </Mjml>
    )
}

import {JsfxrResource} from "@excaliburjs/plugin-jsfxr";
import sounds, {type SoundKeys} from "~/utils/sound";
import {useMemo} from "react";

const useSound = (sound: SoundKeys) => {
    const soundPlugin = useMemo(() => {
        const plugin = new JsfxrResource();

        plugin.init(); //initializes the JSFXR library
        for (const sound in sounds) {
            plugin.loadSoundConfig(sound, sounds[sound]);
        }

        return plugin
    }, [])

    const playSound = () => {
        soundPlugin.playSound(sound)
    }


    return playSound
}

export default useSound
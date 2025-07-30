package com.code2care.common.domain.model;

import lombok.Getter;

@Getter
public enum Language {
    FR("FRENCH"),
    EN("ENGLISH"),
    DLA("DOUALA"),
    BASSA("BASSA"),
    EWONDO("EWONDO");

    private final String code;

    Language(String code) {
        this.code = code;
    }
}

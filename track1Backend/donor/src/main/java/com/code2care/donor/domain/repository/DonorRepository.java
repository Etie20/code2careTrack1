package com.code2care.donor.domain.repository;

import org.springframework.data.domain.Page;

public interface DonorRepository {
    void save();
    Page searchDonor();
}

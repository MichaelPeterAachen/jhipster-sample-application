package com.myapp.domain;

import com.myapp.domain.enumeration.RecommendationPeriodTime;
import com.myapp.domain.enumeration.Unit;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A MineralRecommendation.
 */
@Entity
@Table(name = "mineral_recommendation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MineralRecommendation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "min_amount")
    private Float minAmount;

    @Column(name = "max_amount")
    private Float maxAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "unit")
    private Unit unit;

    @Column(name = "time_period_length")
    private Long timePeriodLength;

    @Enumerated(EnumType.STRING)
    @Column(name = "time_period_dimension")
    private RecommendationPeriodTime timePeriodDimension;

    @OneToOne
    @JoinColumn(unique = true)
    private Mineral mineral;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MineralRecommendation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getMinAmount() {
        return this.minAmount;
    }

    public MineralRecommendation minAmount(Float minAmount) {
        this.setMinAmount(minAmount);
        return this;
    }

    public void setMinAmount(Float minAmount) {
        this.minAmount = minAmount;
    }

    public Float getMaxAmount() {
        return this.maxAmount;
    }

    public MineralRecommendation maxAmount(Float maxAmount) {
        this.setMaxAmount(maxAmount);
        return this;
    }

    public void setMaxAmount(Float maxAmount) {
        this.maxAmount = maxAmount;
    }

    public Unit getUnit() {
        return this.unit;
    }

    public MineralRecommendation unit(Unit unit) {
        this.setUnit(unit);
        return this;
    }

    public void setUnit(Unit unit) {
        this.unit = unit;
    }

    public Long getTimePeriodLength() {
        return this.timePeriodLength;
    }

    public MineralRecommendation timePeriodLength(Long timePeriodLength) {
        this.setTimePeriodLength(timePeriodLength);
        return this;
    }

    public void setTimePeriodLength(Long timePeriodLength) {
        this.timePeriodLength = timePeriodLength;
    }

    public RecommendationPeriodTime getTimePeriodDimension() {
        return this.timePeriodDimension;
    }

    public MineralRecommendation timePeriodDimension(RecommendationPeriodTime timePeriodDimension) {
        this.setTimePeriodDimension(timePeriodDimension);
        return this;
    }

    public void setTimePeriodDimension(RecommendationPeriodTime timePeriodDimension) {
        this.timePeriodDimension = timePeriodDimension;
    }

    public Mineral getMineral() {
        return this.mineral;
    }

    public void setMineral(Mineral mineral) {
        this.mineral = mineral;
    }

    public MineralRecommendation mineral(Mineral mineral) {
        this.setMineral(mineral);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MineralRecommendation)) {
            return false;
        }
        return id != null && id.equals(((MineralRecommendation) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MineralRecommendation{" +
            "id=" + getId() +
            ", minAmount=" + getMinAmount() +
            ", maxAmount=" + getMaxAmount() +
            ", unit='" + getUnit() + "'" +
            ", timePeriodLength=" + getTimePeriodLength() +
            ", timePeriodDimension='" + getTimePeriodDimension() + "'" +
            "}";
    }
}
